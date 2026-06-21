import json
import re
import uuid
from datetime import timedelta

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.sessions.models import Session
from django.db import IntegrityError
from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt

from .models import Order, Product, SupplyRequest

MAIN_ADMIN_EMAIL = 'admin@herbarium.ru'
MAIN_ADMIN_USERNAME = 'admin'


def product_payload(product):
    return {
        'id': product.id,
        'title': product.title,
        'category': product.category,
        'form': product.form,
        'price': product.price,
        'popular': product.popular,
        'tone': product.tone,
        'image_url': product.image_url,
        'description': product.description,
    }


def user_payload(user):
    return {
        'id': user.id,
        'name': user.first_name or user.username,
        'email': user.email,
        'username': user.username,
        'is_admin': user.is_staff or user.is_superuser,
    }


def admin_required(request):
    if request.GET.get('admin') == MAIN_ADMIN_EMAIL:
        return True
    if request.META.get('HTTP_X_HERBARIUM_ADMIN') == MAIN_ADMIN_EMAIL:
        return True
    return request.user.is_authenticated and (request.user.is_staff or request.user.is_superuser)


def is_main_admin(user):
    return user.username == MAIN_ADMIN_USERNAME or user.email == MAIN_ADMIN_EMAIL


def read_json(request):
    try:
        return json.loads(request.body.decode('utf-8') or '{}')
    except json.JSONDecodeError:
        return {}


def is_valid_email(email):
    return '@' in (email or '').strip()


def is_valid_phone(phone):
    value = (phone or '').strip()
    digits = re.sub(r'\D', '', value)
    return len(digits) >= 10 and re.fullmatch(r'[\d\s()+-]+', value) is not None


def make_tracking_number():
    prefix = timezone.now().strftime('HB-%y%m%d')
    while True:
        number = f'{prefix}-{uuid.uuid4().hex[:6].upper()}'
        if not Order.objects.filter(tracking_number=number).exists():
            return number


def products(request):
    items = [product_payload(product) for product in Product.objects.all()]
    return JsonResponse({'products': items})


@csrf_exempt
def admin_products(request):
    if not admin_required(request):
        return JsonResponse({'detail': 'Forbidden'}, status=403)

    if request.method == 'GET':
        return JsonResponse({'products': [product_payload(product) for product in Product.objects.all()]})

    if request.method == 'POST':
        payload = read_json(request)
        product = Product.objects.create(
            title=payload.get('title', '').strip() or 'Новый сбор',
            category=payload.get('category', '').strip() or 'Травяные сборы',
            form=payload.get('form', '').strip() or 'Пакет',
            price=int(payload.get('price') or 0),
            popular=bool(payload.get('popular')),
            tone=payload.get('tone', '').strip() or 'from-lime-200 to-emerald-500',
            image_url=payload.get('image_url', '').strip(),
            description=payload.get('description', '').strip(),
        )
        return JsonResponse({'product': product_payload(product)}, status=201)

    return JsonResponse({'detail': 'Method not allowed'}, status=405)


@csrf_exempt
def admin_product_detail(request, product_id):
    if not admin_required(request):
        return JsonResponse({'detail': 'Forbidden'}, status=403)

    try:
        product = Product.objects.get(pk=product_id)
    except Product.DoesNotExist:
        return JsonResponse({'detail': 'Not found'}, status=404)

    if request.method == 'DELETE':
        product.delete()
        return JsonResponse({'ok': True})

    if request.method == 'PUT':
        payload = read_json(request)
        for field in ['title', 'category', 'form', 'tone', 'image_url', 'description']:
            if field in payload:
                setattr(product, field, payload.get(field) or '')
        if 'price' in payload:
            product.price = int(payload.get('price') or 0)
        if 'popular' in payload:
            product.popular = bool(payload.get('popular'))
        product.save()
        return JsonResponse({'product': product_payload(product)})

    return JsonResponse({'detail': 'Method not allowed'}, status=405)


def admin_summary(request):
    if not admin_required(request):
        return JsonResponse({'detail': 'Forbidden'}, status=403)

    orders_qs = Order.objects.all()
    orders = orders_qs.count()
    products_count = Product.objects.count()
    users_count = User.objects.count()
    online = Session.objects.filter(expire_date__gte=timezone.now()).count()
    revenue = 0
    purchases = 0
    for order in orders_qs:
        for item in order.payload.get('items', []):
            qty = int(item.get('qty') or 1)
            price = int(item.get('price') or 0)
            purchases += qty
            revenue += price * qty

    today = timezone.localdate()
    chart = []
    for offset in range(6, -1, -1):
        day = today - timedelta(days=offset)
        day_orders = orders_qs.filter(created_at__date=day).count()
        chart.append({'label': day.strftime('%d.%m'), 'value': day_orders})

    return JsonResponse({
        'stats': {
            'online': online,
            'orders': orders,
            'purchases': purchases,
            'products': products_count,
            'users': users_count,
            'revenue': revenue,
        },
        'chart': chart,
    })


@csrf_exempt
def admin_users(request):
    if not admin_required(request):
        return JsonResponse({'detail': 'Forbidden'}, status=403)

    if request.method == 'GET':
        return JsonResponse({'users': [user_payload(user) for user in User.objects.all().order_by('id')]})

    if request.method == 'POST':
        payload = read_json(request)
        user_id = payload.get('user_id')
        is_admin = bool(payload.get('is_admin'))
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return JsonResponse({'detail': 'Not found'}, status=404)

        if is_main_admin(user):
            user.email = MAIN_ADMIN_EMAIL
            user.is_staff = True
            user.is_superuser = True
            user.save()
            return JsonResponse({'user': user_payload(user)})

        user.is_staff = is_admin
        user.save()
        return JsonResponse({'user': user_payload(user)})

    return JsonResponse({'detail': 'Method not allowed'}, status=405)


def session(request):
    if request.user.is_authenticated:
        return JsonResponse({'user': user_payload(request.user)})
    return JsonResponse({'user': None})


@csrf_exempt
def login_view(request):
    if request.method != 'POST':
        return JsonResponse({'detail': 'Method not allowed'}, status=405)

    payload = read_json(request)
    email = payload.get('email', '').strip()
    password = payload.get('password', '')

    if not is_valid_email(email):
        return JsonResponse({'detail': 'Укажите корректный email с символом @'}, status=400)

    user_obj = User.objects.filter(email=email).first() or User.objects.filter(username=email).first()
    username = user_obj.username if user_obj else email
    user = authenticate(request, username=username, password=password)

    if user is None:
        return JsonResponse({'detail': 'Неверный email или пароль'}, status=400)

    login(request, user)
    return JsonResponse({'user': user_payload(user)})


@csrf_exempt
def register_view(request):
    if request.method != 'POST':
        return JsonResponse({'detail': 'Method not allowed'}, status=405)

    payload = read_json(request)
    name = payload.get('name', '').strip() or 'Покупатель'
    email = payload.get('email', '').strip().lower()
    password = payload.get('password', '')

    if not email or not password:
        return JsonResponse({'detail': 'Укажите email и пароль'}, status=400)
    if not is_valid_email(email):
        return JsonResponse({'detail': 'Укажите корректный email с символом @'}, status=400)

    try:
        user = User.objects.create_user(username=email, email=email, password=password, first_name=name)
    except IntegrityError:
        return JsonResponse({'detail': 'Пользователь уже существует'}, status=400)

    login(request, user)
    return JsonResponse({'user': user_payload(user)}, status=201)


@csrf_exempt
def logout_view(request):
    if request.method != 'POST':
        return JsonResponse({'detail': 'Method not allowed'}, status=405)
    logout(request)
    return JsonResponse({'ok': True})


@csrf_exempt
def orders(request):
    if request.method != 'POST':
        return JsonResponse({'detail': 'Method not allowed'}, status=405)

    payload = read_json(request)
    phone = payload.get('phone', '').strip()

    if not is_valid_phone(phone):
        return JsonResponse({'detail': 'Укажите корректный номер телефона'}, status=400)

    tracking_number = make_tracking_number()
    order = Order.objects.create(
        user=request.user if request.user.is_authenticated else None,
        name=payload.get('name', '').strip(),
        phone=phone,
        city=payload.get('city', '').strip(),
        address=payload.get('address', '').strip(),
        tracking_number=tracking_number,
        comment=payload.get('comment', '').strip(),
        payload={**payload, 'tracking_number': tracking_number},
    )
    return JsonResponse({'ok': True, 'order_id': order.id, 'tracking_number': tracking_number}, status=201)


@csrf_exempt
def track_order(request):
    if request.method != 'POST':
        return JsonResponse({'detail': 'Method not allowed'}, status=405)

    payload = read_json(request)
    tracking_number = payload.get('tracking_number', '').strip().upper()
    if not tracking_number:
        return JsonResponse({'detail': 'Введите трек-номер'}, status=400)

    order = Order.objects.filter(tracking_number__iexact=tracking_number).first()
    if order is None:
        return JsonResponse({'detail': 'Заказ с таким трек-номером не найден'}, status=404)

    return JsonResponse({
        'order': {
            'id': order.id,
            'tracking_number': order.tracking_number,
            'status': 'Заказ оформлен',
            'city': order.city,
            'created_at': order.created_at.strftime('%d.%m.%Y'),
        }
    })


@csrf_exempt
def supply_requests(request):
    if request.method != 'POST':
        return JsonResponse({'detail': 'Method not allowed'}, status=405)

    payload = read_json(request)
    user = request.user if request.user.is_authenticated else None
    user_id = payload.get('user_id')
    user_email = payload.get('user_email', '').strip().lower()
    user_name = payload.get('user_name', '').strip() or 'Покупатель'

    if user is None and user_id:
        user = User.objects.filter(pk=user_id).first()
    if user is None and user_email:
        user = User.objects.filter(email=user_email).first() or User.objects.filter(username=user_email).first()
    if user is None and user_email:
        try:
            user = User.objects.create_user(
                username=user_email,
                email=user_email,
                password=None,
                first_name=user_name,
            )
        except IntegrityError:
            user = User.objects.filter(email=user_email).first() or User.objects.filter(username=user_email).first()

    if user is None:
        return JsonResponse({'detail': 'Войдите в аккаунт, чтобы отправить оптовую заявку'}, status=403)

    phone = payload.get('phone', '').strip()
    if not is_valid_phone(phone):
        return JsonResponse({'detail': 'Укажите корректный номер телефона'}, status=400)

    supply_request = SupplyRequest.objects.create(
        user=user,
        company=payload.get('company', '').strip(),
        phone=phone,
        contact=payload.get('contact', '').strip(),
        volume=payload.get('volume', '').strip(),
        comment=payload.get('comment', '').strip(),
        payload=payload,
    )
    return JsonResponse({'ok': True, 'request_id': supply_request.id}, status=201)

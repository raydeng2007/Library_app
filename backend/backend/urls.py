from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from books import views

router = routers.DefaultRouter()
router.register(r'books', views.BookView, 'books')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/reserve/books/<int:book_id>/', views.ReserveBook.as_view()),
    path('api/borrowed/',views.BorrowedBookList.as_view()),
    path('api/available/',views.AvailableBookList.as_view()),
]

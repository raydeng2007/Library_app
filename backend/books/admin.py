from django.contrib import admin
from .models import Book


class BookAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'author', 'is_borrowed', 'book_id')


admin.site.register(Book, BookAdmin)

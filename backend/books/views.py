from rest_framework import viewsets
from .serializers import BookSerializer
from .models import Book
from rest_framework import mixins, generics
from rest_framework import filters


class BookView(viewsets.ModelViewSet):

    queryset = Book.objects.all()
    serializer_class = BookSerializer
    filter_backends = (filters.SearchFilter,)
    search_fields = ['title']


class ReserveBook(generics.GenericAPIView, mixins.UpdateModelMixin):

    queryset = Book.objects.all()
    serializer_class = BookSerializer

    def put(self, request, *args, **kwargs):
        self.kwargs['pk'] = request.data.get('id')
        return self.partial_update(request, *args, **kwargs)


class BorrowedBookList(generics.ListAPIView):

    serializer_class = BookSerializer
    model = Book

    def get_queryset(self):
        return Book.objects.filter(is_borrowed=True)


class AvailableBookList(generics.ListAPIView):

    serializer_class = BookSerializer
    model = Book

    def get_queryset(self):
        return Book.objects.filter(is_borrowed=False)

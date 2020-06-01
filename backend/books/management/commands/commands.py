import json
from django.core.management.base import BaseCommand
from books.models import Book

class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument('library-data-source.json', type=str)

    def handle(self, *args, **options):
        with open(options['library-data-source.json']) as f:
            data_list = json.load(f)

        for data in data_list:

            quantity = int(data['quantity'])
            for _ in range(quantity):

                Book.objects.create(book_id=data['id'],
                                    title=data['title'],
                                    author=data['author'],
                                    )
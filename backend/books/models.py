from django.db import models


class Book(models.Model):
    title = models.CharField(max_length=120)
    author = models.CharField(max_length=60)
    book_id = models.IntegerField(null=False)
    is_borrowed = models.BooleanField(default=False,null=False)

    def _str_(self):
        return self.title

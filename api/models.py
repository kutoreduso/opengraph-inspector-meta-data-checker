from django.db import models

# Create your models here.

class Scan(models.Model):
    url = models.URLField(max_length=500)
    scanned_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.url

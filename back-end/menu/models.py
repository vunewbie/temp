from django.db import models
from django.core.validators import MinValueValidator
from accounts.models import Branch

# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name
    
    class Meta:
        db_table = 'Category'

class Dish(models.Model):
    name = models.CharField(max_length=255, unique=True)
    price = models.IntegerField(validators=[MinValueValidator(0)])
    description = models.TextField(null=True, blank=True)
    image = models.ImageField(upload_to='dishes/', null=True, blank=True)
    status = models.BooleanField(default=True)

    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    def __str__(self):
        return self.name
    
    class Meta:
        db_table = 'Dish'
    
class Menu(models.Model):
    dish = models.ForeignKey(Dish, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)

    is_available = models.BooleanField(default=True)
    is_deliverable = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.dish.name} - {self.branch.name}"
    
    class Meta:
        constraints = [models.UniqueConstraint(
            fields=['dish', 'branch'],
            name='unique_dish_branch'
        )]
        db_table = 'Menu'

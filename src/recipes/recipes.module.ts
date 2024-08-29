import { Module } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './entities/recipe.entity';
import { CategoriesModule } from 'src/categories/categories.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Recipe]), CategoriesModule, UsersModule],
  exports: [TypeOrmModule, RecipesService],
  controllers: [RecipesController],
  providers: [RecipesService],
})
export class RecipesModule {}

import { Category } from 'src/categories/entities/category.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Like } from 'src/likes/entities/like.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Recipe {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: false })
  title: string;
  @Column({ nullable: false })
  content: string;
  @Column('text', { array: true, default: [] })
  ingredients: string[];
  @Column('text', { array: true, default: [] })
  instructions: string[];
  @Column('text', { array: true, default: [] })
  files: string[];
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
  @ManyToOne(() => User, (user) => user.recipes)
  @JoinColumn({ name: 'user_id' })
  user: User;
  @ManyToOne(() => Category, (category) => category.recipes)
  @JoinColumn({ name: 'category_id' })
  category: Category;
  @OneToMany(() => Comment, (comment) => comment.recipe)
  comments: Comment[];
  @OneToMany(() => Like, (like) => like.recipe)
  likes: Like[];
}

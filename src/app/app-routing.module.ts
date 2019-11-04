import { TestComponent } from './test/test.component';
import { DashboradComponent } from './management/dashborad/dashborad.component';
import { AuthGuard, AuthGuardAdmin } from './_guards/auth.guard';
import { UserCourseComponent } from './user-course/user-course.component';
import { CoursesComponent } from './course/course-list/courses.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CourseDetailComponent } from './course/course-detail/course-detail.component';
import { UserManageComponent } from './user-manage/user-manage.component';
import { SearchDetailComponent } from './search-detail/search-detail.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ResetPasswordConfirmComponent } from './reset-password-confirm/reset-password-confirm.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'search/:name',
    component: SearchDetailComponent
  },
  {
    path: 'courses-view/:id',
    component: CourseDetailComponent
  },
  {
    path: 'courses',
    component: CoursesComponent
  },
  {
    path: 'mycourses',
    component: UserCourseComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    component: UserManageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    component: DashboradComponent,
    canActivate: [AuthGuard,AuthGuardAdmin]
  },
  {
    path: 'resetpassword',
    component: ResetPasswordComponent
  },
  {
    path: 'resetPassword/:id',
    component: ResetPasswordConfirmComponent
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

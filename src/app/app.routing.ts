import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AdminComponent } from './admin/admin.component';
import { ParentAuthGuard } from './shared/guard/parentGuard';
import { MyItemsComponent } from './my-items/my-items.component';
import { UserHomeComponent } from './user-home/user-home.component';

const appRoutes: Routes = [
    { path: 'items', component: HomeComponent },
    { path: 'admin', component: AdminComponent, canActivate: [ParentAuthGuard] },
    { path: 'user/profile', component: UserHomeComponent, canActivate: [ParentAuthGuard] },
    { path: 'user/posts', component: MyItemsComponent, canActivate: [ParentAuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    // otherwise redirect to home
    { path: '**', redirectTo: 'items' }
];

export const routing = RouterModule.forRoot(appRoutes);
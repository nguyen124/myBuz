import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AdminComponent } from './admin/admin.component';
import { ParentAuthGuard } from './shared/guard/parentGuard';
import { MyItemsComponent } from './my-items/my-items.component';

const appRoutes: Routes = [
    { path: 'items', component: HomeComponent },
    { path: 'admin', component: AdminComponent, canActivate: [ParentAuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'user/items', component: MyItemsComponent, canActivate: [ParentAuthGuard] },
    {
        path: 'user/profile',
        loadChildren: () => import('./users/users.module').then(m => m.UsersModule)
    },
    {
        path: '',
        redirectTo: 'items',
        pathMatch: 'full'
    }
];

export const routing = RouterModule.forRoot(appRoutes);
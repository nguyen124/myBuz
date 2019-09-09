import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AdminComponent } from './admin/admin.component';
import { ParentAuthGuard } from './guard/parentGuard';
import { MyItemsComponent } from './my-items/my-items.component';

const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'admin', component: AdminComponent, canActivate: [ParentAuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'users/:userId/items', component: MyItemsComponent },
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
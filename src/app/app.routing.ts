import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AdminComponent } from './admin/admin/admin.component';
import { ParentAuthGuard } from './shared/guard/parentGuard';
import { MyItemsComponent } from './my-items/my-items.component';
import { SaveLoginComponent } from './save-login/save-login.component';
import { AdminAuthGuard } from './shared/guard/adminGuard';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ResetPasswordFormComponent } from './reset-password-form/reset-password-form.component';
import { UploadComponent } from './upload/upload.component';
import { UpdateItemComponent } from './update-item/update-item.component';

const appRoutes: Routes = [
    { path: 'items', component: HomeComponent },
    { path: 'items/:itemId/update', component: UpdateItemComponent },
    { path: 'admin', component: AdminComponent, canActivate: [AdminAuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'requestResetPassword', component: ResetPasswordComponent },
    { path: 'resetPassword', component: ResetPasswordFormComponent },
    { path: 'savelogin', component: SaveLoginComponent },
    { path: 'user/items', component: MyItemsComponent, canActivate: [ParentAuthGuard] },
    { path: 'user/upload', component: UploadComponent, canActivate: [ParentAuthGuard] },
    {
        path: 'user/profile',
        loadChildren: () => import('./users/users.module').then(m => m.UsersModule)
    },
    {
        path: 'legal',
        loadChildren: () => import('./policy-term/policy-term.module').then(m => m.PolicyTermModule)
    },
    {
        path: 'admin',
        loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
    },
    // {
    //     path: 'nodes',
    //     loadChildren: () => import('./nodes-module/nodes.module').then(m => m.NodesModule)
    // },
    {
        path: '',
        redirectTo: 'items?temp=cold&page=0&perPage=40',
        pathMatch: 'full'
    }
];

export const routing = RouterModule.forRoot(appRoutes, { relativeLinkResolution: 'legacy' });
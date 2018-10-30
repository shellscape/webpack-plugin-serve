import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {HelloComponent} from './app.component';

@NgModule({
    imports:      [BrowserModule, FormsModule ],
    bootstrap:    [HelloComponent],
    declarations: [HelloComponent],
})
export class AppModule {}

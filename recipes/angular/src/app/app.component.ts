import {Component} from '@angular/core';

@Component({
  selector: 'message',
  styles: [require('./app.component.scss')],
  template: require('./app.component.html'),
})
export class HelloComponent {
  message = 'na na na na na na na na BATMAN!';
}

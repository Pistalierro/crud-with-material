import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'textLength',
  standalone: true
})
export class TextLengthPipe implements PipeTransform {

  transform(str: string, length: 40): string {
    const arr = str.split(' ');
    let result = '';

    for (let i = 0; i < arr.length; i++) {
      if ((result.length + arr[i].length + 1) > length) {
        result = result.trim().replace(/[.,!/`'"_-]/g, '').concat('...');
        break;
      }
      result += ` ${arr[i]}`;
    }

    return result;
  }

}

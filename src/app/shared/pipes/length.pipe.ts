import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'length',
  standalone: true
})
export class LengthPipe implements PipeTransform {

  transform(str: string, length: number): string {
    const arr = str.split(' ');
    let res = '';

    for (let i = 0; i < arr.length; i++) {
      if ((res.length + arr[i].length) > length) {
        res = res.trim().replace(/[.,?_-]/g, '').concat('...');
        break;
      }
      res += ` ${arr[i]}`;
    }

    return res;
  }

}

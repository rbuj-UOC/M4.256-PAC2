import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate',
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false
})
export class FormatDatePipe implements PipeTransform {
  transform(value: Date, ...args: number[]): unknown {
    let newFormat = '';

    const dateTransform = new Date(value);
    const type: number = args[0];

    const dd = dateTransform.getDate();
    const mm = dateTransform.getMonth() + 1;
    const yyyy = dateTransform.getFullYear();

    const ddFormat = this.needZero(dd);
    const mmFormat = this.needZero(mm);

    if (type === 1) {
      newFormat = ddFormat + mmFormat + yyyy;
    }
    if (type === 2) {
      newFormat = ddFormat + ' / ' + mmFormat + ' / ' + yyyy;
    }
    if (type === 3) {
      newFormat = ddFormat + '/' + mmFormat + '/' + yyyy;
    }
    if (type === 4) {
      newFormat = yyyy + '-' + mmFormat + '-' + ddFormat;
    }

    return newFormat;
  }

  private needZero(checkNumber: number): string {
    return checkNumber < 10 ? '0' + checkNumber : String(checkNumber);
  }
}

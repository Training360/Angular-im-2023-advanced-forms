import { CommonModule, LowerCasePipe } from '@angular/common';
import { Component, Provider, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-country-selector',
  standalone: true,
  imports: [
    CommonModule,
    LowerCasePipe,
  ],
  templateUrl: './country-selector.component.html',
  styleUrl: './country-selector.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CountrySelectorComponent,
      multi: true
    }
  ],
})
export class CountrySelectorComponent implements ControlValueAccessor {

  formControl: FormControl = new FormControl();

  countries = [
    { code: 'HU', name: 'HUN' },
    { code: 'US', name: 'USA' },
    { code: 'NL', name: 'NL' },
    { code: 'JM', name: 'JM' },
    { code: 'SZ', name: 'SZ' },
  ];
  selected!: string;
  disabled = false;
  private onTouched!: Function;
  private onChanged!: Function;

  selectCountry(code: string) {
    this.onTouched();
    this.selected = code;
    this.onChanged(code);
  }

  writeValue(value: string): void {
    this.selected = value ?? 'IN';
  }
  registerOnChange(fn: any): void {
    this.onChanged = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

}



import { CommonModule } from '@angular/common';
import { Component, Provider, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const COUNTRY_CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CountrySelectorComponent),
  multi: true,
};

@Component({
  selector: 'app-country-selector',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './country-selector.component.html',
  styleUrl: './country-selector.component.scss',
  providers: [
    COUNTRY_CONTROL_VALUE_ACCESSOR,
  ],
})
export class CountrySelectorComponent implements ControlValueAccessor {
  countries = [
    { code: 'IN', name: 'India' },
    { code: 'US', name: 'United States' },
    { code: 'NL', name: 'Netherlands' },
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

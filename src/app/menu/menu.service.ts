import { Injectable } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Injectable({
  providedIn: "root"
})
export class MenuService {
  form: FormGroup;
  constructor(private formBuilder: FormBuilder) {
    this.createForm();
  }

  private createForm() {
    this.form = this.formBuilder.group({
      rows: [Validators.min(0)]
    });
  }
}

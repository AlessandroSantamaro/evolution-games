import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormOptions,
  GameFormItem,
  GameResult, GamesDtoResponse,
} from '../../../models/games/games.model';
import { FieldMeta, MetaDtoResponse } from '../../../models/games/meta.model';
import {
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { GamesService } from '../../../services/games/games.service';
import { MetaService } from '../../../services/meta-table/meta.service';
import { isEmptyArray } from '../../../shared/utils';
import { combineLatestWith } from 'rxjs';
import { ButtonStyles } from '../../../models/styles/buttons.model';

@Component({
  selector: 'app-game-form',
  templateUrl: './games-form.component.html',
  styleUrls: ['./games-form.component.scss'],
})
export class GamesFormComponent implements OnInit {
  @Input() submitLabel: string = 'Submit';

  @Output() onSubmit = new EventEmitter<GameResult>();

  gameForm!: FormGroup;
  gameFormItems: GameFormItem[] = [];

  items: GameResult[] = [];
  metaData: MetaDtoResponse | undefined;
  selectedElement: { [key: string]: any } | undefined;
  selectedId: number | undefined;
  updateButtonStyle: ButtonStyles = ButtonStyles.primary;
  genericErrorMessage: string = '';

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _gamesService: GamesService,
    private _metaService: MetaService
  ) {}

  ngOnInit(): void {
    this._route.paramMap.subscribe((paramMap: ParamMap) => {
      this.paramsHandler(paramMap);
    });

    this._gamesService.gamesData$
      .pipe(combineLatestWith(this._metaService.metaData$))
      .subscribe(([gamesData, metaData]) => {
        this.gamesFormHandler(gamesData, metaData);
      });

    this._gamesService.getGamesData();
    this._metaService.geMetaData();
  }

  paramsHandler(paramMap: ParamMap): void {
    this.selectedId = undefined; // Delete previous changes
    const id = paramMap.get('id');
    if (id) {
      if (!isNaN(+id)) {
        this.selectedId = +id;
      }
    }

    // Check if it's add or edit form
    if (
      this.selectedId &&
      this.items &&
      !isEmptyArray(this.items) &&
      this.metaData
    ) {
      this.initForm(true, this.metaData, this.selectedId, this.items);

    } else if (
      !this.selectedId &&
      this.items &&
      !isEmptyArray(this.items) &&
      this.metaData
    ) {
      this.initForm(false, this.metaData);
    }
  }

  gamesFormHandler(gamesData: GamesDtoResponse | null, metaData: MetaDtoResponse | null): void {
    if (gamesData && metaData) {
      this.items = gamesData.results;
      this.metaData = metaData;
      if (this.selectedId) {
        this.initForm(true, this.metaData, this.selectedId, this.items);
      } else {
        const param = this._route.snapshot.paramMap.get('id');
        if (!param) {
          this.initForm(false, this.metaData);
        }
      }
    }
  }

  submit() {
    this.gameForm.markAllAsTouched();
    if (this.gameForm.valid) {
      this.onSubmit.emit(this.gameForm.value);
      this.genericErrorMessage = '';
    } else {
      this.genericErrorMessage = 'Form invalid, please check form errors';
    }
  }

  backToGame(): void {
    this._router.navigate(['games']);
  }

  initForm(
    isEdit: boolean,
    metaData: MetaDtoResponse,
    selectedId?: number,
    items?: GameResult[]
  ): void {
    if (isEdit && selectedId) {
      let newSelectedEl;
      if (!isNaN(+selectedId) && items && !isEmptyArray(items)) {
        newSelectedEl = items.find((item) => item.id === selectedId);
      }
      this.selectedElement = newSelectedEl;

      if (!this.selectedElement) {
        // Item not found
        this._router.navigate(['games']);
        return;
      }
    }

    this.setForm(isEdit, metaData);
  }

  setForm(isEdit: boolean, metaData: MetaDtoResponse): void {
    const group: any = {};
    this.gameFormItems = [];

    // Iterate form fields
    metaData.fields.forEach((field: FieldMeta) => {
      // Calculate input form type
      const inputType: string = this.getInputType(field.type);

      // Check if it's a dropdown, if yes: retrieve options
      let options: FormOptions[] | undefined = [];
      if (inputType === 'dropdown') {
        options = this.setDropdownValues(field, inputType, metaData);
      }

      // Set form item values
      const gameFormItem: GameFormItem = {
        id: field.key,
        label: field.label,
        type: inputType,
        required: field.required,
        readOnly: field.read_only,
        options: !isEmptyArray(options) ? options : undefined,
      };
      this.gameFormItems.push(gameFormItem);

      // Calculate form item validators
      const validators: ValidatorFn[] = this.getFormValidators(field);

      // Set default form value
      this.setDefaultFormValue(
        isEdit,
        field,
        inputType,
        options,
        gameFormItem,
        group,
        validators
      );
    });

    if (isEdit) {
      this.gameForm = new FormGroup(group);
    } else {
      this.gameForm = new FormGroup(group, { updateOn: 'submit' });
    }
  }

  setDropdownValues(
    field: FieldMeta,
    inputType: string,
    metaData: MetaDtoResponse
  ): FormOptions[] {
    let dropdownOptions: FormOptions[] = [];

    const fieldOptions = metaData.options[field.key as keyof FieldMeta];
    if (fieldOptions) {
      // Retrieve dropdown options
      dropdownOptions = fieldOptions.options.map((item) => {
        return {
          key: item.id,
          value: item[field.key as keyof FieldMeta],
          label: item.descriptive_name,
        } as FormOptions;
      });
    }
    return dropdownOptions;
  }

  getFormValidators(field: FieldMeta): ValidatorFn[] {
    const validators: ValidatorFn[] = [];

    if (field.required) {
      validators.push(Validators.required);
    }
    if (!field.allow_empty) {
      validators.push(Validators.minLength(1));
    }
    if (!field.allow_null) {
      validators.push(Validators.nullValidator);
    }
    if (field.max_length) {
      validators.push(Validators.maxLength(field.max_length));
    }
    if (field.type === 'integer') {
      validators.push(Validators.pattern('^[0-9]*$'));
    }

    return validators;
  }

  setDefaultFormValue(
    isEdit: boolean,
    field: FieldMeta,
    inputType: string,
    dropdownOptions: FormOptions[] | undefined,
    gameFormItem: GameFormItem,
    group: any = {},
    validators: ValidatorFn[]
  ): void {
    if (isEdit && this.selectedElement) {
      // Set previous values if present
      let defaultValue:
        | string
        | boolean
        | { value: string | boolean; disabled: boolean } = '';

      if (!isEmptyArray(dropdownOptions)) {
        let dropKey =
          dropdownOptions?.find(
            (item) =>
              this.selectedElement &&
              item.label === this.selectedElement[field.key]
          )?.value || field.key;

        defaultValue =
          (this.selectedElement &&
            this.selectedElement[field.key] &&
            dropKey) ||
          '';

        if (inputType === 'dropdown' && !gameFormItem?.options?.length) {
          // Empty dropdown options, disable it
          defaultValue = { value: undefined!, disabled: true };
        }
      } else {
        // If it's a dropdown there are not values to show
        defaultValue =
          inputType === 'dropdown'
            ? { value: undefined, disabled: true }
            : this.selectedElement && this.selectedElement[field.key];
      }

      group[field.key] = new FormControl(defaultValue, validators);
    } else if (!isEdit) {
      let defaultValue;
      if (inputType === 'dropdown' && !gameFormItem?.options?.length) {
        defaultValue = { value: undefined, disabled: true };
      }

      group[field.key] = new FormControl(defaultValue, validators);
    }
  }

  getInputType(type: string): string {
    let inputType;
    switch (type) {
      case 'integer':
        inputType = 'number';
        break;
      case 'string':
        inputType = 'text';
        break;
      case 'field':
        inputType = 'dropdown';
        break;
      case 'boolean':
        inputType = 'checkbox';
        break;
      case 'datetime':
        inputType = 'datetime-local';
        break;
      default:
        inputType = 'text';
    }
    return inputType;
  }

  trackByFn(index: number, obj: object): number {
    return index;
  }
}

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GamesFormComponent } from './games-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder, ValidatorFn } from '@angular/forms';
import { FieldMeta } from '../../../models/games/meta.model';
import { ParamMap } from '@angular/router';

describe('GameFormComponent', () => {
  let component: GamesFormComponent;
  let fixture: ComponentFixture<GamesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GamesFormComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GamesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check if the getInputType return the right types', () => {
    expect(component.getInputType('integer')).toBe('number');
    expect(component.getInputType('string')).toBe('text');
    expect(component.getInputType('field')).toBe('dropdown');
    expect(component.getInputType('boolean')).toBe('checkbox');
    expect(component.getInputType('datetime')).toBe('datetime-local');
    expect(component.getInputType('not-valid')).toBe('text');
  });

  it('should check if the trackByFn returns the index', () => {
    expect(component.trackByFn(1, {})).toBe(1);
  });

  it('should check if the valid form submit', () => {
    spyOn(component.onSubmit, 'emit');
    const myModel = { id: 1, name: 'Name' };
    const fb = new FormBuilder();
    component.gameForm = fb.group(myModel);
    expect(component.gameForm.valid).toBeTruthy();
    component.submit();
    expect(component.onSubmit.emit).toHaveBeenCalledTimes(1);
  });

  it('should check if form validators are set properly (required)', () => {
    const field: FieldMeta = {
      key: 'name',
      type: 'string',
      required: true,
      allow_empty: true,
      allow_null: true,
      read_only: false,
      label: 'Name label',
    };
    const validators: ValidatorFn[] = component.getFormValidators(field);
    expect(validators).toBeDefined();
    expect(validators.length).toBe(1); // Just required validator
  });

  it('should check if form validators are set properly', () => {
    const field: FieldMeta = {
      key: 'name',
      type: 'integer',
      required: true,
      allow_empty: false,
      allow_null: false,
      read_only: false,
      label: 'Name label',
      max_length: 10,
    };
    const validators: ValidatorFn[] = component.getFormValidators(field);
    expect(validators).toBeDefined();
    expect(validators.length).toBe(5); // required, minLenght, maxLenght, null, pattern number
  });

  it('Wait data to show the form', () => {
    spyOn(component, 'initForm');
    component.gamesFormHandler(null, null);
    expect(component.items.length).toBe(0);
    expect(component.metaData).toBe(undefined);
    expect(component.initForm).not.toHaveBeenCalled();
  });
});

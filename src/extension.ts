'use strict';

import * as vscode from 'vscode';
import { matInputField, matRadioGroup, matSelectField, matCheckBox, matTextAreaField } from './mat-field-templates';

let tabs = '';
let form = '';
let formName = '';
let matFieldsCollection = '';
let getters = '';
let ctrlPath = '';

let matRadios: string[] = [];
let matSelects: string[] = [];
let matTextAreas: string[] = [];
let matCheckBoxes: string[] = [];

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('extension.ngFormBuilder', function () {
				// Get the active text editor
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			const document = editor.document;
			const selection = editor.selection;
			const selectedText = document.getText(selection);
						
			if (selectedText === '') {
				return;
			}

			vscode.window.showInputBox({prompt: 'enter form name.'}).then(name => {

				if (name === undefined) { 
					return;
				}

				formName = name;
				// do initialization...
				form = formName + " = this.fb.group({";
				matFieldsCollection = '<div [formGroup]="' + formName + '">';

				// now determine what type of mat form component he/she wants, and for which property
				vscode.window.showInputBox({
					prompt: 'Which properties should be radio buttons; enter names separated by comma.\n',
					placeHolder: 'e.g gender'
				}).then(names => {
					if (names !== undefined) {
						matRadios = names.trim().replace(/\s/g, '').split(',');
					}

					vscode.window.showInputBox({
						prompt: 'Which properties should be "mat-select"; enter names separated by comma.\n',
						placeHolder: 'e.g. country,city'
					}).then(names => {
						if (names !== undefined) {
							matSelects = names.trim().replace(/\s/g, '').split(',');
						}

						vscode.window.showInputBox({
							prompt: 'Which properties should be "mat-checkbox"; enter names separated by comma.\n',
							placeHolder: 'e.g. favouriteCar'
						}).then(names => {
							if (names !== undefined) {
								matCheckBoxes = names.trim().replace(/\s/g, '').split(',');
							}
							vscode.window.showInputBox({
								prompt: 'Which properties should be "textarea"; enter names separated by comma.\n',
								placeHolder: 'e.g. comment,description'
							}).then(names => {
								if (names !== undefined) {
									matTextAreas = names.trim().replace(/\s/g, '').split(',');
								}

								// when all inputBoxes is done then proceed...
								// first try; with JSON
								let obj = parseJson(selectedText);

								if (obj === undefined) {
									// try to eval
									obj = evalObject(selectedText);

									// check whether eval successed
									if (obj === undefined) {
										// not successed return.
										vscode.window.showErrorMessage('The selected text could not be evaluated to object');
										return;
									}
								}

								buildForm(obj);
								// after building form append the ending }); and </div> to matFields
								form += '\n});';
								matFieldsCollection += '\n</div>';

								displayForm();
							}); // check InputBox ends

						}); // textareas inputBox ends
						
					}); // select inputBox ends
				}); // radio btns inputBox ends
			}); // form name inputBox() ends;
		}
	}); // registerCommand

	context.subscriptions.push(disposable);
}

function prepareObjectToEval(selectedText: string): string {
	const classOrInterfaceNameRegex = /(?:\b.*\b)\{/;
	const semicolonsRegex = /;/g;
	const stringRegex = /string/g;
	const numberRegex = /number/g;
	const booleanRegex = /boolean/g;

	selectedText = selectedText.replace(/\s/g, '');
	const match = classOrInterfaceNameRegex.exec(selectedText);

	if (match === null) {
		return '';
	}

	const objStr = selectedText.replace(match[0], '{')
					.replace(semicolonsRegex, ',')
					.replace(stringRegex, '\'\'')
					.replace(numberRegex, '0')
					.replace(booleanRegex, 'true');
	return objStr;
}

function evalObject(selectedText: string): any {
	let obj;
	
	let objStr = prepareObjectToEval(selectedText);

	if (objStr === '') {
		return undefined;
	}

	try {
		objStr = "obj=" + objStr;

		eval(objStr);
		
		return obj;

	} catch (error) {
		return undefined;
	}
}

function parseJson(selectedText: string): any {

	try {
		return JSON.parse(selectedText);
	} catch (error) {
		return undefined;
	}
}

function buildForm(obj: any) {
	// increase tabs on each nesting start...
	tabs += "\t";

	Object.entries(obj).forEach(o => {
	
		if(typeof(o[1]) == "object") {

			// if nesting object, add formGroup and also add <div formGroup="">
			form += '\n' + tabs + o[0] + ': this.fb.group({';

			matFieldsCollection += "\n\n" + tabs + '<div formGroup="' + o[0] + '">';

			// add the current nested formGroupName to the ctrlPath
			ctrlPath += o[0] + '.';
			
			// recursively call itsef to extract the nesting objects...
			buildForm(o[1]);

			// when the current nesting obj ends
			// complete the current formGroup and also the div
			form += '\n' + tabs + '}),';
			matFieldsCollection += '\n' + tabs + '</div>\n';

			// when current nested formGroupName finished then remove from ctrlPath
			ctrlPath = ctrlPath.replace(o[0] + '.', '');
		}
		else {
			// if it is a property of main object or nested (when buildForm call itself)
			form += '\n' + tabs + o[0] + ': [\'\'],';

			matFieldsCollection += generateMatFormField(o[0], o[1]);

			getters += '\nget ' + o[0] + '() {\n return this.' +
				formName +'.get(\'' + ctrlPath + o[0] + '\');\n}\n'; 
		}
			
	});
	
	// decrease tabs at the end...
	tabs = tabs.replace('\t', '');
	
	return;
}

function generateMatFormField(ctrlName: string, value: any): string {

	if (typeof(value) === 'boolean') {
		return matRadioGroup.replace('ctrlName', ctrlName).replace(/\$tabs/g, tabs);
	} 
	
	if (typeof(value) === 'number') {
		return matInputField.replace('ctrlName', ctrlName).replace(/\$tabs/g, tabs).replace('ctrlType', 'number');
		
	}

	switch(determineMatFieldType(ctrlName)) {
		case "matInput":
			return matInputField.replace('ctrlName', ctrlName)
				.replace(/\$tabs/g, tabs).replace('ctrlType', 'text');
		case "matSelect":
			return matSelectField.replace('ctrlName', ctrlName)
				.replace(/\$tabs/g, tabs);		
		case "matRadio":
			return matRadioGroup.replace('ctrlName', ctrlName)
				.replace(/\$tabs/g, tabs);
		case "matCheckbox":
			return matCheckBox.replace('ctrlName', ctrlName)
				.replace(/\$tabs/g, tabs);
		case "textArea":
			return matTextAreaField.replace('ctrlName', ctrlName)
				.replace(/\$tabs/g, tabs);
		default:
			return matInputField.replace('ctrlName', ctrlName)
			.replace(/\$tabs/g, tabs).replace('ctrlType', 'text');
	}
}

function determineMatFieldType(ctrlName: string): string {

	for (let i=0; i < matRadios.length; i++) {
		if (matRadios[i] === ctrlName) {
			return 'matRadio';
		}
	}

	for (let i=0; i < matSelects.length; i++) {
		if (matSelects[i] === ctrlName) {
			return 'matSelect';
		}
	}

	for (let i=0; i < matCheckBoxes.length; i++) {
		if (matCheckBoxes[i] === ctrlName) {
			return 'matCheckbox';
		}
	}

	for (let i=0; i < matTextAreas.length; i++) {
		if (matTextAreas[i] === ctrlName) {
			return 'textArea';
		}
	}

	// the switch 'default' in generateMatFormField method will handle this..
	return '';
}

function displayForm() {
	vscode.workspace.openTextDocument({ content: form + '\n' + getters}).then(d => {
		form = '';
		getters = '';
	});

	vscode.workspace.openTextDocument({language: 'html', content: matFieldsCollection}).then(d => {
		matFieldsCollection = '';
	});
}

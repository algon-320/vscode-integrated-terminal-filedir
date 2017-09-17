'use strict';

import * as vscode from 'vscode';
import * as path from 'path';

function execute(cmd: string) {
    let editor = vscode.window.activeTextEditor;
    if (!editor) return;
    let document = editor.document;
    if (!document) return;
    let uri = document.uri;
    if (!uri) return;
    let fileDir = path.dirname(uri.fsPath);
    let preDir = vscode.workspace.getConfiguration('terminal.integrated').get('cwd');
    let configuration = vscode.workspace.getConfiguration('terminal.integrated');
    configuration.update('cwd', fileDir, true).then(
        () => {
            console.log('change configuration `terminal.integrated.cwd` to', fileDir);
            vscode.commands.executeCommand(cmd).then(
                () => {
                    console.log('restore configuration `terminal.integrated.cwd` to', preDir);
                    configuration.update('cwd', preDir, true);
                }
            )
        }
    );
}

export function activate(context: vscode.ExtensionContext) {
    let cmdToggle = vscode.commands.registerCommand('workbench.action.terminal.toggleTerminalAtFiledir', () => {
        execute('workbench.action.terminal.toggleTerminal');
    });
    context.subscriptions.push(cmdToggle);
    let cmdNew = vscode.commands.registerCommand('workbench.action.terminal.newAtFiledir', () => {
        execute('workbench.action.terminal.new');
    });
    context.subscriptions.push(cmdNew);
}

export function deactivate() {
}
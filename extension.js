const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log('Congratulations, your extension "react-class-to-clipboard" is now active!');

    const disposable = vscode.commands.registerCommand('react-classes-to-selector.react-selector', function () {
        // Получаем активный текстовый редактор
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            const selection = editor.selection;
            const text = editor.document.getText(selection);

            // Регулярное выражение для поиска className и id
            const classNames = new Set();
            const ids = new Set();
            const classNameRegex = /className\s*=\s*["']([^"']+)["']/g;
            const idRegex = /id\s*=\s*["']([^"']+)["']/g;
            let match;

            // Поиск всех className
            while ((match = classNameRegex.exec(text)) !== null) {
                match[1].split(' ').forEach(className => classNames.add(`.${className} {}`));
            }

            // Поиск всех id
            while ((match = idRegex.exec(text)) !== null) {
                ids.add(`#${match[1]} {}`);
            }

            // Преобразуем Set в массив и отсортируем его
            const uniqueClassNames = Array.from(classNames).sort();
            const uniqueIds = Array.from(ids).sort();

            // Объединяем classNames и ids и копируем в буфер обмена
            const uniqueSelectors = uniqueClassNames.concat(uniqueIds).join('\n');
            vscode.env.clipboard.writeText(uniqueSelectors)
                .then(() => {
                    vscode.window.showInformationMessage('Class names and IDs copied to clipboard!');
                })
                .catch(err => {
                    vscode.window.showErrorMessage(`Failed to copy text to clipboard: ${err}`);
                });
        } else {
            vscode.window.showInformationMessage('No active editor found!');
        }
    });

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
}

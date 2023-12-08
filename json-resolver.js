const { exec } = require('child_process');
const fs = require('fs');

const command = process.argv.slice(2);

const jsonFilePath = 'src/assets/forms.json';
const jsonForms = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));

function transformOutput(output) {
  Object.keys(jsonForms).forEach(key => {
    for (const field of jsonForms[key].fields) {
      if (!field.cmpPath || !field.cmpName) {
        continue;
      }

      const regBase = field.cmpPath.replace(/\-[A-Z0-9]{6,10}\.js$/, '.*\.js');
      const reg = new RegExp(regBase.replace(/\//g, ''), 'gm');
      const match = output.match(reg);
      if (match) {
        field.cmpPath = '/' + match[0];
        fs.writeFileSync(jsonFilePath, JSON.stringify(jsonForms, null, 2));
        console.log(`Updated ${jsonFilePath}`, field.cmpPath);
      }
    }
  });
  return output;
}

function runNpmScript(scriptName) {
  // const npmProcess = exec('npm', ['run', scriptName]);
  const npmProcess = exec(scriptName);

  // Listen for data event to capture the output
  npmProcess.stdout.on('data', data => {
    const output = data.toString();

    // Transform and display the output
    const transformedOutput = transformOutput(output);
    console.log(transformedOutput);
  });

  // Listen for error event and display the error message
  npmProcess.stderr.on('data', data => {
    console.error(data.toString());
  });

  // Listen for exit event and display the exit code
  npmProcess.on('exit', code => {
    console.log(`Child process exited with code ${code}`);
  });
}

runNpmScript(command[0]);

const readline = require('readline');
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter your site name: ', async siteName => {
  if (!siteName || /[<>:"/\\|?*]/.test(siteName)) {
    console.log('Invalid site name. Please try again.');
    rl.close();
    return;
  }

  rl.question('Enter baseHref (default: "/"): ', async baseHref => {
    baseHref = baseHref || '/';

    rl.question('Enter deployUrl (default: "/"): ', async deployUrl => {
      deployUrl = deployUrl || '/';

      const src = './src/sites/Exzy';
      const dst = `./src/sites/${siteName}`;

      if (!fs.existsSync(dst)) {
        fse.copySync(src, dst);
        console.log(`Directory ${dst} created successfully.`);
      } else {
        console.log(`Directory ${dst} already exists.`);
        rl.close();
        return;
      }

      try {
        await updateAngularJson(siteName, baseHref, deployUrl);
        console.log('Angular configuration updated successfully!');
      } catch (error) {
        console.error(`Failed to update angular.json: ${error.message}`);
      }

      rl.close();
    });
  });
});

async function updateAngularJson(siteName, baseHref, deployUrl) {
  const filePath = path.join(__dirname, 'angular.json');
  const fileData = JSON.parse(fs.readFileSync(filePath));

  const newBuildConfig = {
    [siteName]: {
      "outputPath": `dist/${siteName}`,
      "baseHref": baseHref,
      "deployUrl": deployUrl,
      "fileReplacements": [
        {
          "replace": "src/environments/environment.ts",
          "with": `src/sites/${siteName}/environments/environment.prod.ts`
        }
      ],
      "stylePreprocessorOptions": {
        "includePaths": [
          "src/styles-default",
          `src/sites/${siteName}`
        ]
      },
      "assets": [
        "src/assets",
        {
          "glob": "**/*",
          "input": `src/sites/${siteName}/config`,
          "output": "/config"
        }
      ]
    }
  };

  const newServeConfig = {
    [siteName]: {
      "browserTarget": `SmartLocker-Web:build:${siteName}`
    }
  };

  fileData.projects['SmartLocker-Web'].architect.build.configurations = {
    ...fileData.projects['SmartLocker-Web'].architect.build.configurations,
    ...newBuildConfig
  };

  fileData.projects['SmartLocker-Web'].architect.serve.configurations = {
    ...fileData.projects['SmartLocker-Web'].architect.serve.configurations,
    ...newServeConfig
  };

  fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2));
}

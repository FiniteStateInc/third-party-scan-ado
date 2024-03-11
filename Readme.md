
# [Finite State](https://finitestate.io) `third-party-upload` Extension for Azure DevOps

![Finite state logo](./Tasks/thirdPartyUpload/screenshots/FS-Logo.png)
[finitestate.io](https://finitestate.io)

The Finite State `third-party-upload` Extension allows you to easily integrate the Finite State Platform into your Azure Devops Pipeline.

Here you will find how this [extension was build](https://learn.microsoft.com/en-us/azure/devops/extend/develop/add-build-task?toc=%2Fazure%2Fdevops%2Fmarketplace-extensibility%2Ftoc.json&view=azure-devops) and how you could release a new version of the extension.

We won't follow the typescript approach due we have some issues following Microsoft documentation. At a first approach we did it just in javascript.


Our extension execute a [js file](./Tasks/thirdPartyUpload/main.js). On that file we execute our python script that upload the third party upload and did the comment stuff.

You could see the extension documentation itself [here](Marketplace.md)

## Release a new Version

Requirements:
 - Install [npx](https://www.npmjs.com/package/npx)
 - Install [tfx-cli](https://www.npmjs.com/package/tfx-cli)

Run `make bump` to build a new vsix file to upload to azure markeplace.

## Run test in local environment
You have different commands in [Makefile](Tasks/thirdPartyUpload/Makefile) inside Tasks/thirdPartyUpload folder.
```bash
make install-all  # mainly it install python and js dependencies
make test-all     # run js and python tests
```

## Package and publish extension
- [Markeplace URL](https://marketplace.visualstudio.com/manage/publishers/finite-state)

- [How to Package and publish extesions](https://learn.microsoft.com/en-us/azure/devops/extend/publish/overview?toc=%2Fazure%2Fdevops%2Fmarketplace-extensibility%2Ftoc.json&view=azure-devops)

- [Publish by command line](https://learn.microsoft.com/en-us/azure/devops/extend/publish/command-line?toc=%2Fazure%2Fdevops%2Fmarketplace-extensibility%2Ftoc.json&view=azure-devops)

### Update extension

If you want to update your tasks, you would first need to raise the version of your extension, otherwise the marketplace won’t let you publish it. To do this, simply edit the “version” attribute in your [vss-extension.json](vss-extension.json) file, and make sure it is higher than the previous one. When you run `make publish` this is done automatically.

You would also need to update the version of your [tasks](Tasks/thirdPartyUpload/task.json) changing the version attribute, which corresponds with the ‘Task version’ drop down option in your build or release pipeline if you’re familiar with it.

When you raise the ‘Major’ attribute, it would be applied to newly added tasks and enable the option to update existing task (by choosing the newer version in the dropdown options). Meanwhile, the ‘Minor’ attribute would automatically update them, and ‘Patch’ is generally reserved for minor bug fixes. One thing to keep in mind, if your update have some possible breaking changes, it is recommended to update the ‘Major’ version, because it won’t automatically update every tasks that are already added, so that they won’t throw any error if anything does break.
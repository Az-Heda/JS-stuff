# JS-Docs parser

## Notify


###  Methods 

#### - permission 

Ask for permission to write notifications to the user
| Return types |
| :----------: |
| Promise.<string> |
 
- `async method`
- `static method`

#### - send 

Send a notification to the user


####  Parameters 

| Name | Type | Default | Description |
| ---- | :--: | :-----: | ----------- |
| title | string |  | Title of the notification |
| text | string |  | Text of the notification |
| cbs | Object |  | Some callback to be called in the notification stages |
| options | Object |  | Some options to give the user a better experience |

| Return types |
| :----------: |
| Notification |
 
- `static method`

#### - logger 

Write a message on console


####  Parameters 

| Name | Type | Default | Description |
| ---- | :--: | :-----: | ----------- |
| text | string |  | Text to write on console |
| status | string |  | Status type for the error |
| lv | Number | 1 | Error level, this will ignore the log message if the level is higher than the current level |

| Return types |
| :----------: |
 
- `static method`

#### - addStatusToLogger 

Create a new status to add to the logger


####  Parameters 

| Name | Type | Default | Description |
| ---- | :--: | :-----: | ----------- |
| name | string |  | Name of the new status for the logger |
| bg | string |  | HEX of the background color |
| color | string |  | HEX of the text color |

| Return types |
| :----------: |
 
- `static method`


<hr/>

###  Getters 

#### - status 

Return the current permission status
| Return types |
| :----------: |
| 'Allowed' |
| 'Denied' |
| 'Not allowed' |
 
- `static method`

#### - isEnabled 

Check if Notifications are enabled on the current browser
| Return types |
| :----------: |
| Boolean |
 
- `static method`

#### - level 

Get the logger level
| Return types |
| :----------: |
| number |
 
- `static method`


<hr/>

###  Setters 

#### - level 

Set the logger level


####  Parameters 

| Name | Type | Default | Description |
| ---- | :--: | :-----: | ----------- |
| newLevel | number |  | New level for the logger |

| Return types |
| :----------: |
| number |
 
- `static method`


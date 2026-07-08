Set fso = CreateObject("Scripting.FileSystemObject")
scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)
Set WshShell = CreateObject("WScript.Shell")
scriptPath = scriptDir & "\iniciar-robo.bat"
WshShell.Run """" & scriptPath & """", 0, False
Set WshShell = Nothing
Set fso = Nothing

Set WshShell = CreateObject("WScript.Shell")
scriptPath = WshShell.CurrentDirectory & "\iniciar-robo.bat"
WshShell.Run """" & scriptPath & """", 0, False
Set WshShell = Nothing

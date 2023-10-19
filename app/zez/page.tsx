// 'use client';

// import { useState } from 'react';

export default function Page() {
  const echoPath =
    'C:\\Program Files\\Common Files\\Oracle\\Java\\javapath;C:\\Program Files (x86)\\Common Files\\Oracle\\Java\\javapath;C:\\WINDOWS\\system32;C:\\WINDOWS;C:\\WINDOWS\\System32\\Wbem;C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\;C:\\WINDOWS\\System32\\OpenSSH\\;C:\\Users\\sboba\\AppData\\Roaming\\nvm;C:\\Program Files\\nodejs;C:\\docker\\;C:\\Program Files\\dotnet\\;C:\\Program Files\\Git\\cmd;C:\\Program Files\\PowerShell\\7\\;C:\\Users\\sboba\\scoop\\shims;C:\\Users\\sboba\\AppData\\Local\\Microsoft\\WindowsApps;C:\\Users\\sboba\\AppData\\Local\\Programs\\Microsoft VS Code\\bin;C:\\Users\\sboba\\AppData\\Roaming\\nvm;C:\\Program Files\\nodejs;C:\\Users\\sboba\\AppData\\Local\\Programs\\oh-my-posh\\bin;C:\\Users\\sboba\\AppData\\Local\\JetBrains\\Toolbox\\scripts;C:\\Users\\sboba\\AppData\\Local\\Programs\\Microsoft VS Code Insiders\\bin';
  // split this string on semicolon(;) and make a array with each path
  const paths = echoPath.split(';');
  console.log(paths);

  // loop through each path with map
  const pathItems = paths.map((path: string) => {
    return <div className='w-full flex '>{path}</div>;
  });

  return <div>{pathItems}</div>;
}

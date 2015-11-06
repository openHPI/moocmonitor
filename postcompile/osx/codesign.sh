# Invoke this script with a relative `.app` path
# EX:
# codesign.sh "dist/osx/MyApp-darwin-x64/MyApp.app"

# I had better luck using the iPhoneOS codesign_allocate
# export CODESIGN_ALLOCATE="/Applications/Xcode.app/Contents/Developer/Platforms/iPhoneOS.platform/Developer/usr/bin/codesign_allocate"

# Next two are specified in Apple docs:
# export CODESIGN_ALLOCATE="/Applications/Xcode.app/Contents/Developer/usr/bin/codesign_allocate"
export CODESIGN_ALLOCATE="/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/codesign_allocate"

# However, neither worked, and gave error:
# /Users/JoshBavari/Development/ionic-gui/dist/osx/MyApp-darwin-x64/MyApp.app/Contents/Frameworks/Electron Framework.framework/Electron Framework: cannot find code object on disk

#Run the following to get a list of certs
# security find-identity
app="$PWD/$1"
identity="Felix Rieseberg"

echo "### signing frameworks"
codesign --deep --force --verify --verbose --sign "$identity" "$app/Contents/Frameworks/Electron Framework.framework/Electron Framework"
codesign --deep --force --verify --verbose --sign "$identity" "$app/Contents/Frameworks/Electron Framework.framework/Versions/A"
codesign --deep --force --verify --verbose --sign "$identity" "$app/Contents/Frameworks/Electron Framework.framework/Versions/Current/Electron Framework"
codesign --deep --force --verify --verbose --sign "$identity" "$app/Contents/Frameworks/Electron Helper EH.app/Contents/MacOS/Electron Helper EH"
codesign --deep --force --verify --verbose --sign "$identity" "$app/Contents/Frameworks/Electron Helper NP.app/Contents/MacOS/Electron Helper NP"
codesign --deep --force --verify --verbose --sign "$identity" "$app/Contents/Frameworks/Electron Helper NP.app/Contents/MacOS/Electron Helper NP"
codesign --deep --force --verify --verbose --sign "$identity" "$app/Contents/Frameworks/MyApp Helper.app/Contents/MacOS/MyApp Helper"
codesign --deep --force --verify --verbose --sign "$identity" "$app/Contents/Frameworks/Mantle.framework/Mantle"
codesign --deep --force --verify --verbose --sign "$identity" "$app/Contents/Frameworks/Mantle.framework/Versions/A"
codesign --deep --force --verify --verbose --sign "$identity" "$app/Contents/Frameworks/ReactiveCocoa.framework/ReactiveCocoa"
codesign --deep --force --verify --verbose --sign "$identity" "$app/Contents/Frameworks/ReactiveCocoa.framework/Versions/A"
codesign --deep --force --verify --verbose --sign "$identity" "$app/Contents/Frameworks/Squirrel.framework/Squirrel"
codesign --deep --force --verify --verbose --sign "$identity" "$app/Contents/Frameworks/Squirrel.framework/Versions/A"

echo "### signing app"
codesign --deep --force --verify --verbose --sign "$identity" "$app"


echo "### Zipping app"
ditto -c -k --sequesterRsrc --keepParent "./builds/Azure Storage Explorer-darwin-x64/Azure Storage Explorer.app/" ./builds/storageexplorer-osx.zip

echo "### verifying signature",
codesign -vvvv -d "$app"
sudo spctl -a -vvvv "$app"
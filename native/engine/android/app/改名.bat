@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo APK/AAB文件重命名工具
echo ====================
echo 正在处理 release 目录下的文件...

set "new_name=ChristamsGiftMatch-release"
set "count=0"

:: 检查release目录是否存在
if not exist "release" (
    echo 错误：未找到 release 目录！
    pause
    exit /b 1
)

:: 切换到release目录
pushd "release"

:: 重命名APK文件
for %%f in (*.apk) do (
    set /a count+=1
    ren "%%f" "!new_name!.apk"
    echo 已重命名: "release\%%f" -> "release\!new_name!.apk"

)

:: 重命名AAB文件
for %%f in (*.aab) do (
    set /a count+=1
    ren "%%f" "!new_name!.aab"
    echo 已重命名: "release\%%f" -> "release\!new_name!.aab"
)

:: 返回原目录
popd

if %count%==0 (
    echo release 目录中未找到任何.apk或.aab文件
) else (
    echo.
    echo 完成！共重命名了 %count% 个文件
)

pause
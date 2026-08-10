-- TerminalBuddy Clink Lua Integration for cmd.exe (Tabby Command Prompt)

local function base64_encode(data)
    local b = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    return ((data:gsub('.', function(x) 
        local r,b='',x:byte()
        for i=8,1,-1 do r=r..(b%2^i-b%2^(i-1)>=2^(i-1) and '1' or '0') end
        return r
    end)..'0000'):gsub('%d%d%d?%d%d%d?', function(x)
        if (#x < 6) then return '' end
        local c=0
        for i=1,6 do c=c+(x:sub(i,i)=='1' and 2^(6-i) or 0) end
        return b:sub(c+1,c+1)
    end)..({ '', '==', '=' })[#data%3+1])
end

local function tb_on_prompt()
    local cwd = os.getcwd() or ""
    local dashPath = "C:\\ProgramData\\TerminalBuddy\\dashboard.txt"
    local dashB64 = ""

    local f = io.open(dashPath, "rb")
    if not f then
        local userProfile = os.getenv("USERPROFILE")
        if userProfile then
            f = io.open(userProfile .. "\\dashboard\\dashboard.txt", "rb")
        end
    end

    if f then
        local content = f:read("*a")
        f:close()
        if content and #content > 0 then
            local clean = content:gsub("\x1b%[[0-9;]*[a-zA-Z]", "")
            dashB64 = base64_encode(clean)
        end
    end

    local osc = string.char(27) .. "]7701;prompt;cwd=" .. cwd .. ";dashboard=" .. dashB64 .. string.char(7)
    io.stdout:write(osc)
    io.stdout:flush()
end

if clink and clink.onbeginedit then
    clink.onbeginedit(tb_on_prompt)
elseif clink and clink.prompt then
    clink.prompt.register_filter(function()
        tb_on_prompt()
    end, 1)
end

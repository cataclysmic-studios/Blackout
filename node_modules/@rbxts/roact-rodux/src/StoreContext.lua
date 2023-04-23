local nodeModules = script.Parent.Parent.Parent
local Roact = require(nodeModules.roact.src)

local StoreContext = Roact.createContext()

return StoreContext
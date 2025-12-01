export const backendNodes = [
    {id: "1", name: "Dana Thompson", influence: "high"},
    {id: "2", name: "Petra", influence: "medium"},
    {id: "3", name: "Daniel", influence: "medium"},
    {id: "4", name: "Lisa", influence: "low"},
    {id: "5", name: "Adam", influence: "low"},
    {id: "6", name: "Charles", influence: "medium"},
    {id: "7", name: "Robert", influence: "high"}
]

export const backendEdges = [
    {source: "2", target: "3", relationship: "reports to"},
    {source: "3", target: "1", relationship: "influences"},
    {source: "3", target: "1", relationship: "reports to"},
    {source: "4", target: "6", relationship: "reports to"},
    {source: "5", target: "3", relationship: "influences"},
    {source: "4", target: "7", relationship: "influences"},
    {source: "6", target: "1", relationship: "influences"},

]
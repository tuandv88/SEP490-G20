import { createColumnHelper } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

const columnHelper = createColumnHelper()

export const columns = [
  columnHelper.display({
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.accessor("title", {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-bold"
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  }),
//   columnHelper.accessor("problemType", {
//     header: "Problem Type",
//     cell: ({ row }) => {
//       const value = row.getValue("problemType")
//       return (
//         <Badge variant={value === "Practice" ? "default" : value === "Assessment" ? "secondary" : "destructive"}>
//           {value}
//         </Badge>
//       )
//     },
//   }),
  columnHelper.accessor("difficulty", {
    header: "Difficulty",
    cell: ({ row }) => {
      const value = row.getValue("difficulty")
      return (
        <Badge variant={value === "Easy" ? "success" : value === "Medium" ? "warning" : "destructive"}>
          {value}
        </Badge>
      )
    },
  }),
//   columnHelper.accessor("status", {
//     header: "Status",
//     cell: ({ row }) => {
//       const value = row.getValue("status")
//       return (
//         <p>{value}</p>
//       )
//     },
//   }),
  columnHelper.display({
    id: "actions",
    cell: ({ row }) => {
      const problem = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(problem.id)}
            >
              Copy problem ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View problem details</DropdownMenuItem>
            <DropdownMenuItem>Edit problem</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  }),
]


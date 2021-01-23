import React, {useEffect, useState} from 'react'
import {Table, TableHead, TableRow, TableCell, makeStyles, TableSortLabel} from '@material-ui/core'

export default function CustomTable(records, headCells, filterFn) {
    const [order, setOrder] = useState()
    const [orderBy, setOrderBy] = useState()

    const handleSortRequest = (cellId) => {
        const isAsc = orderBy === cellId && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(cellId)
    }

    useEffect(() => {
        console.log('calling sort', orderBy, order)
        recordsAfterSorting()
    }, [orderBy, order])


    function stableSort(array, comparator) {
        const stabilizedThis = array.map((el, index) => [el, index])
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0])
            // if (order) return order
            // return a[1] - b[1]
            return order ? order : a[1] - b[1]
        })
        return stabilizedThis.map((el) => el[0])
    }

    function getComparator(order, orderBy) {

        console.log('here')
        if (order === 'desc') {
            return (a, b) => {
                if (b[orderBy] < a[orderBy])
                    return -1
                if (b[orderBy] > a[orderBy])
                    return 1
                return 0
            }
        } else {
            return (a, b) => {
                if (b[orderBy] < a[orderBy])
                    return 1
                if (b[orderBy] > a[orderBy])
                    return -1
                return 0
            }
        }
    }

    const recordsAfterSorting = () => {
        console.log('sorted', stableSort(filterFn.fn(records), getComparator(order, orderBy)))
        return stableSort(filterFn.fn(records), getComparator(order, orderBy))
    }

    const SortableTable = ({children}) => (
        <Table>
            <TableHead>
                <TableRow>
                    {headCells.map(headCell => (
                        <TableCell key={headCell.id}
                                   sortDirection={orderBy === headCell.id ? order : false}>
                            {!headCell.sortable ? headCell.name :
                                <TableSortLabel
                                    active={orderBy === headCell.id}
                                    direction={orderBy === headCell.id ? order : 'asc'}
                                    onClick={() => handleSortRequest(headCell.id)}
                                >
                                    {headCell.name}
                                </TableSortLabel>
                            }
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>

            {children}
        </Table>
    )

    return {
        SortableTable,
        recordsAfterSorting
    }
}

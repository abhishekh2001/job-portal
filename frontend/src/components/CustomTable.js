import React, {useEffect, useState} from 'react'
import {Table, TableHead, TableRow, TableCell, makeStyles, TableSortLabel} from '@material-ui/core'

const CustomTable = ({
                         records,
                         headCells,
                         filterFn,
                         setData,
                         children
                     }) => {
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
            if (order !== 0) return order
            return a[1] - b[1]
        })
        return stabilizedThis.map((el) => el[0])
    }

    function getComparator(order, orderBy) {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy)
    }

    function descendingComparator(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
            return -1
        }
        if (b[orderBy] > a[orderBy]) {
            return 1
        }
        return 0
    }

    const recordsAfterSorting = () => {
        setData(stableSort(filterFn.fn(records), getComparator(order, orderBy)))
    }

    return (
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
}

export default CustomTable
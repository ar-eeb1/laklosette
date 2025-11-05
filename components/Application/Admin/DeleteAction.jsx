import { Delete } from '@mui/icons-material'
import { ListItemIcon, MenuItem } from '@mui/material'
import Link from 'next/link'
import React from 'react'

const DeleteAction = ({ handleDelete, row, deleteType }) => {
    return (
        <MenuItem key='edit' onClick={() => handleDelete([row.original._id], deleteType)}>
            <ListItemIcon>
                <Delete />
            </ListItemIcon>
            Delete
        </MenuItem>
    )
}

export default DeleteAction

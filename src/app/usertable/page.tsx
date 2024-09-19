"use client";


import { QueryClient, QueryClientProvider, useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Edituser from './Edituser';
import Deleteuser from './Deleteuser';
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, Row, useReactTable } from '@tanstack/react-table';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export default function MyTable () {
  const queryClient = new QueryClient();
  const [currentPage, setCurrentPage] = useState(1); // Track the current page directly
    const pageSize = 5;
    const [pagination,setPagination] = useState({pageIndex: 0,pageSize: 5,})

    const [editRow, setEditRow] = useState<any>(null); // Track the row being edited
    const [editData, setEditData] = useState({ username: '', email: '' }); // Store the edit form data

 





    const fetchTableData = async (page: number) => {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users?_page=${page}&_limit=${pageSize}`);
      return response.json();
    };


      const { 
        isLoading, 
        isError, 
        data, 
        error ,
      } = useQuery({
        queryKey: ['tableData', currentPage],
        queryFn: () => fetchTableData(currentPage),
      });
  


      const updateUserMutation = useMutation({
        mutationFn: async (userData: any) => {
          try {
            const { id, ...rest } = userData;
            const response = await axios.put(`/api/auth/signup?id=${id}`, rest);
            return response.data;
          } catch (error) {
            console.error('Error updating user:', error);
            throw new Error('Failed to update user');
          }
        },
        onSuccess: () => {
          queryClient.invalidateQueries();
        },
        onError: (error) => {
          console.error('Mutation error:', error); // Capture any error during mutation
        }
      });

      const columns = [
        {
          accessorKey: 'id',
          header: 'ID',
        },
        {
          accessorKey: 'username',
          header: 'Name',
          cell: ({ row }: { row: Row<any> }) =>
              editRow?.id === row.original.id ? (
                  <input
                      type="text"
                      value={editData.username}
                      onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                  />
              ) : (
                  row.original.username
              ),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }: { row: Row<any> }) =>
            editRow?.id === row.original.id ? (
                <input
                    type="text"
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                />
            ) : (
                row.original.email
            ),
    },


    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: { row: Row<any> }) => (
          <div>
              {editRow?.id === row.original.id ? (
                  <>
                      <button onClick={() => handleSave(row.original.id)}>Save</button>
                      <button onClick={handleCancel}>Cancel</button>
                  </>
              ) : (
                  <>
                      <Edituser onClick={() => handleEdit(row.original)} />
                        
                      <Deleteuser onClick={() => handleDelete(row.original.id)} />
                     
                  </>
              )}
          </div>
      ),
  },
        
      ];
    


      const handleEdit = (rowData: any) => {
        setEditRow(rowData);
        setEditData({ username: rowData.username, email: rowData.email }); // Pre-fill the form with existing data
    };



    const handleSave = (id: number) => {
      // Update the data with the new values (mock update)
      const updatedData = data.map((row: any) => (row.id === id ? { ...row, ...editData } : row));
      queryClient.setQueryData(['tableData', currentPage], updatedData);

      setEditRow(null); // Reset edit mode
      console.log('Saved:', id, editData); // For debugging
  };



  const handleCancel = () => {
    setEditRow(null);
};




const handleDelete = (id: number) => {
  console.log('Delete:', id);
};


      const table = useReactTable({
        data: data ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),   
    
        getPaginationRowModel: getPaginationRowModel(),   
    
        manualPagination: true,

        pageCount: Math.ceil(10 / pageSize), // Assuming 10 total items in JSONPlaceholder
        onPaginationChange: (updaterOrNewState) => {
            // Handle pagination changes from the table's UI (Previous/Next buttons)
            if (typeof updaterOrNewState === 'function') {
              setPagination(updaterOrNewState(pagination)); // Use the defined setPagination and pagination
            } else {
              setPagination(updaterOrNewState); 
            }
          },
        state: {
          pagination: {
            pageIndex: currentPage - 1, // Adjust for 0-based pageIndex in table
            pageSize,
          },
        },
        
      
      });



  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }


  return (
    <div >
           <QueryClientProvider client={queryClient}>
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} onClick={() => {
                //   table.setSorting({ id: header.id, desc: !header.column.getIsSorted() === 'desc' });
                // table.setSorting([{ id: header.id, desc: !header.column.getIsSorted() === 'desc' }]);
                // table.setSorting({ columnId: header.id, desc: !header.column.getIsSorted() === 'desc' });
                table.setSorting([{
                    id: header.id, // Use 'id' instead of 'columnId'
                    desc: header.column.getIsSorted() ? (header.column.getIsSorted() === 'asc') : true 
                  }]);

                }}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                    )}
                {{
  asc: ' 🔼',
  desc: ' 🔽',
}[header.column.getIsSorted() === 'desc' ? 'desc' : 'asc'] ?? null}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr key={row.id}>
            {row.getVisibleCells().map(cell => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>

      <div>
        <button
        //   onClick={() => table.previousPage()}
        onClick={() => setCurrentPage(Number(currentPage-1))}
          disabled={currentPage==1}
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentPage(Number(currentPage+1))}
          disabled={currentPage==2}
        >
          {/* {isFetchingNextPage ? 'Loading...' : 'Next'} */}
          Next
        </button>

        {/* Page selection dropdown */}
        

<select
          value={currentPage}
          onChange={e => setCurrentPage(Number(e.target.value))}
          style={{
            backgroundColor: 'black', 
            color: 'white',
            border: '1px solid white',
            marginLeft: '5px'
          }}
        >
          {[...Array(table.getPageCount())].map((_, i) => (
            <option key={i} value={i + 1}>
              Go to page {i + 1}
            </option>
          ))}
        </select>


      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
    </div>
  )
}


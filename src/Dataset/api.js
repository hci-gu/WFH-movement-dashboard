import { useEffect } from 'react'
import axios from 'axios'
import { useRecoilState } from 'recoil'
import { datasetAtom } from './state'
import { useParams } from 'react-router'
const API_URL = process.env.REACT_APP_API_URL
const ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN

const api = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: ACCESS_TOKEN,
  },
})

const getAllRows = async (id, rows = [], offset = 0) => {
  const response = await api.get(
    `/analytics/dataset/${id}?limit=1000&offset=${offset}`
  )

  if (!response.data.rows.length) {
    return rows
  }

  return getAllRows(id, [...rows, ...response.data.rows], offset + 1)
}

export const useDataset = () => {
  const { id } = useParams()
  const [dataset, setDataset] = useRecoilState(datasetAtom)

  useEffect(() => {
    if (!id) return
    const getRows = async () => {
      const rows = await getAllRows(id)
      console.log(rows)
      setDataset(rows)
    }
    getRows()
  }, [setDataset, id])

  return dataset
}

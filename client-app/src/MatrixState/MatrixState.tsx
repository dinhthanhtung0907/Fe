import React, { Component } from 'react';
import { Container, TextField, Button, Grid, Typography } from '@material-ui/core';
import axios from 'axios';
import { Constant } from '../Common/Constant';
import { TreasureRes } from './interface';

// Định nghĩa kiểu dữ liệu cho state của component
interface MatrixState {
  n: number;
  m: number;
  p: number;
  matrix: number[][];
  result: number | null;
  errorMessage: string;
}

interface MatrixProps { }

class MatrixInput extends Component<MatrixProps, MatrixState> {
  constructor(props: MatrixProps) {
    super(props);
    this.state = {
      n: 0,
      m: 0,
      p: 0,
      matrix: [],
      result: null,
      errorMessage: ''
    };
  }

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState({ ...this.state, [name]: Number(value), matrix: [] });
  };

  handleMatrixInput = (e: React.ChangeEvent<HTMLInputElement>, row: number, col: number) => {
    const { n, m } = this.state;

    let newMatrix: number[][];
    if (this.state.matrix.length === 0) {
      newMatrix = Array(n).fill(0).map(() => Array(m).fill(0));
    } else {
      newMatrix = [...this.state.matrix];
    }

    newMatrix[row][col] = Number(e.target.value);

    this.setState({ matrix: newMatrix });
  };

  handleSubmit = () => {
    const { n, m, p, matrix } = this.state;

    // Validate input
    if (n <= 0 || m <= 0 || p <= 0 || matrix.length !== n || matrix.some(row => row.length !== m)) {
      this.setState({ errorMessage: 'Please ensure that all inputs are valid and the matrix is correctly filled out.' });
      return;
    }
    const res = this.findTreasure(n, m, p, matrix);
    return;
  };

  findTreasure = (n: number, m: number, p: number, matrix: number[][]): void => {
    let data = axios.post(Constant.BEUrl + `/treasure/onepiece-treasure`, {
      n: n,
      m: m,
      p: p,
      matrix: matrix
    })
      .then(res => {
        this.setState({ result: res.data.data, errorMessage: res.data?.message ?? '' });
      })
    return
  };

  renderMatrixInputs() {
    const { n, m } = this.state;
    const matrixInputs = [];

    for (let i = 0; i < n; i++) {
      const rowInputs = [];
      for (let j = 0; j < m; j++) {
        rowInputs.push(
          <Grid item key={`${i}-${j}`}>
            <TextField
              label={`(${i + 1},${j + 1})`}
              type="number"
              onChange={(e: any) => this.handleMatrixInput(e, i, j)}
            />
          </Grid>
        );
      }
      matrixInputs.push(
        <Grid justifyContent="center" container spacing={1} key={i}>
          {rowInputs}
        </Grid>
      );
    }
    return matrixInputs;
  }

  render() {
    const { n, m, p, result, errorMessage } = this.state;

    return (
      <Container>
        <Typography variant="h4">Treasure Hunt</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <TextField label="Rows (n)" name="n" type="number" onChange={this.handleInputChange} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="Columns (m)" name="m" type="number" onChange={this.handleInputChange} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="Types of Chest (p)" name="p" type="number" onChange={this.handleInputChange} />
          </Grid>
        </Grid>

        {n > 0 && m > 0 && (
          <div>
            <Typography variant="h6">Matrix Input:</Typography>
            {this.renderMatrixInputs()}
          </div>
        )}

        <Button variant="contained" color="primary" onClick={this.handleSubmit}>
          Find Treasure
        </Button>

        {errorMessage && <Typography color="error">{errorMessage}</Typography>}

        {result !== null && (
          <Typography variant="h6">Minimum Fuel Required: {result}</Typography>
        )}
      </Container>
    );
  }
}

export default MatrixInput;

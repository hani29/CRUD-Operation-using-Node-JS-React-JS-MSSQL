import React, { Component } from 'react';
import './App.css';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import DeleteIcon from '@material-ui/icons/Delete';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import { toast } from 'react-toastify';
import Grid from '@material-ui/core/Grid';
import Modal from 'react-modal';
import CloseIcon from '@material-ui/icons/Close';
import BorderColorIcon from '@material-ui/icons/BorderColor';

const styles = theme => ({
  table: {
    minWidth: 650,
    padding: 0
  },
  paper: {
    maxWidth: 900,
    dispaly: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '5%'
  },
  heading: {
    color: '#fff',
    textTransform: 'capitalize',
    fontSize: 20,
    fontStyle: 'bold'
  }
});
const customStyles = {
  overlay: {
    zIndex: 1200,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: 400,
    width: '100%'
  }
};


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      product: {
        name: ' ',
        price: '',
        open: false,
        modalIsOpen: false,
        modalIsOpen2: false,
        detail: [],
      }
    }
  }

  componentDidMount() {
    this.getProducts();
    this.setState({ open: false })
  }
  closeModal = () => {
    this.setState({ modalIsOpen: false });
  }
  closeModal2 = () => {
    this.setState({ modalIsOpen2: false });
  }
  openModal(e, data, index) {
    let newdata = {
      e, data, index
    }
    this.setState({ modalIsOpen: true })
    e.stopPropagation();

    axios.get('http://localhost:5000/products/' + newdata.data.products_id).then(res => {
      let detail_data = res.data.data[0]
      this.setState({ product_id: detail_data.products_id, name_data: detail_data.name, price_data: detail_data.price });
    }).catch((error) => {
      toast.error("we encountered some error", {
        position: toast.POSITION.TOP_RIGHT
      });
    })
  }

  addproducts = () => {
    const { product } = this.state;
    fetch(`http://localhost:5000/products/add?name=${product.name}&price=${product.price}`)
      .then(this.getProducts)
      .catch(err => console.error(err))
  }

  getProducts = () => {
    fetch('http://localhost:5000/products')
      .then(response => response.json())
      .then(response => {
        this.setState({ products: response.data, open: false })
        console.log(this.state.products)
      })

      .catch(err => console.error(err))
  }
  deleteCat = (e, data, index) => {
    let newdata = {
      data, index
    }
    this.setState({ open: newdata });
    e.stopPropagation();

  }
  getProducts = _ => {
    fetch('http://localhost:5000/products')
      .then(response => response.json())
      .then(response => {
        this.setState({ products: response.data })
        console.log(this.state.products)
      })

      .catch(err => console.error(err))
  }
  // delete(data) {
  //   axios.delete('http://localhost:5000/products/' + data.products_id).then(res => {
  //     toast.success("Deleted successfully", {
  //       position: toast.POSITION.TOP_RIGHT
  //     });
  //     let deldata = this.state.products;
  //     deldata.splice(data.index, 1);
  //     this.setState({ products: deldata, open: false });
  //     console.log("products:",this.state.products)
  //   }).catch((error) => {
  //     toast.error("Sorry! couldn't Delete Category", {
  //       position: toast.POSITION.TOP_RIGHT
  //     });
  //   })

  // }
  delete(e,data,index) {
    e.stopPropagation();
    axios.delete('http://localhost:5000/products/' + data.products_id).then(res => {
      toast.success("Deleted successfully", {
        position: toast.POSITION.TOP_RIGHT
      });
      let deldata = this.state.products;
      deldata.splice(index, 1);
      this.setState({ products: deldata, open: false });
    }).catch((error) => {
      toast.error("Sorry! couldn't Delete Category", {
        position: toast.POSITION.TOP_RIGHT
      });
     
    })
  }
  openModal2(e, data,index) {
    let renamedata={
        e,data,index
    }
    this.setState({ modalIsOpen2: renamedata ,modelindex: true,rename_name:data.name ,rename_price: data.price });
    e.stopPropagation();
}
rename = (data) => {
 
  const { rename_name, rename_price } = this.state
  let dataImage = {
        "products_id": data.data.products_id,
        "name": rename_name,
        "price": rename_price
  }
  axios.put('http://localhost:5000/products/update' , dataImage, { headers: { 'Content-Type': 'application/json' } }).then(res => {
      console.log("Rename successfully", res.data)
      toast.success("Rename successfully", {
          position: toast.POSITION.TOP_RIGHT
      });
      let newarr = this.state.products;
      newarr[data.index].name=dataImage.name;
      newarr[data.index].price=dataImage.price;
      this.setState({prducts:newarr});
      this.closeModal2();
  }).catch((error)=>{
      toast.error("Sorry! couldn't Rename Category",{
          position: toast.POSITION.TOP_RIGHT
      })
  })
}
  render() {
    const { products, product, open, product_id, name_data, price_data, rename_name,rename_price } = this.state
    const { classes } = this.props

    return (
      <Grid container direction="column" justify="center" alignItems="center" spacing={8}>
        <Grid item xs={12}>
          <TableContainer component={Paper} className={classes.paper}>
            <Table className={classes.table}>
              <TableHead style={{ backgroundColor: '#e68888', color: '#fff', textTransform: 'capitalize', fontSize: 30, fontStyle: 'bold'}}>
                <TableRow  >
                  <TableCell className={classes.heading} align="center">PRODUCTS</TableCell>
                  <TableCell className={classes.heading} align="center">PRICE</TableCell>
                  <TableCell className={classes.heading} align="center">Delete</TableCell>
                  <TableCell className={classes.heading} align="center">Update</TableCell>

                </TableRow>
              </TableHead>
              <TableBody>

                {products.map((claim, index) => {
                  return (
                    <TableRow style={{cursor: 'pointer' }} onClick={(e) => this.openModal(e, claim, index)}>
                      <TableCell align="center" style={{textTransform:'capitalize'}}> {claim.name}</TableCell>
                      <TableCell align="center"> {claim.price}</TableCell>
                      <TableCell align="center"><DeleteIcon style={{ boxshadow: 'none', color: '#f73434', fontStyle: 'bold',cursor: 'pointer' }} onClick={(e) => this.delete(e, claim, index)} /></TableCell>
                      <TableCell align="center"><BorderColorIcon style={{ boxshadow: 'none', color: '#a07c7c', fontStyle: 'bold',cursor: 'pointer' }} onClick={(e) => this.openModal2(e, claim,index)} /></TableCell>
                    </TableRow>
                  )

                })}

              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12}>
          <TextField style={{ marginRight: 15 }} label="Enter Name" variant="outlined" value={product.name} onChange={e => this.setState({ product: { ...product, name: e.target.value } })} />
          <TextField label="Enter Price" variant="outlined" value={product.price} onChange={e => this.setState({ product: { ...product, price: e.target.value } })} />
        </Grid>
        <Grid item xs={12} style={{ marginTop: -10 }}>
          <Button style={{ backgroundColor: 'green', boxShadow: 'none', color: 'white', fontStyle: 'bold' }} onClick={this.addproducts}>Add Product</Button>

        </Grid>
        {/* <Dialog onClose={() => this.setState({ open: false })} open={open !== false} >
          <DialogTitle><Typography variant='h6'>Are you sure you want to delete this Product?</Typography>
          </DialogTitle>
          <DialogActions>
            <Button style={{ boxShadow: 'none' }} onClick={() => this.delete(this.state.open)} color="secondary">Delete</Button>
            <Button color="primary" onClick={() => this.setState({ open: false })}>Cancel</Button>
          </DialogActions>
        </Dialog> */}
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
        >
          <div style={{ backgroundColor: '#fff' }}>
            <Grid container alignItems='center' style={{ marginBottom: 10 }}>
              <Grid item xs={9} md={9} >
                <Typography variant="h6" style={{ color: 'red' }}>Product Details</Typography>
              </Grid>
              <Grid xs={3} item md={3} style={{ textAlign: 'right' }}>
                <Button onClick={this.closeModal}><CloseIcon style={{ fontSize: 20 }} /></Button>
              </Grid>
            </Grid>
            <form style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', alignItems: 'left' }}>
              <Typography variant="body2"><span style={{ color: '#462e2e' }}>Product ID: </span>{product_id}</Typography>
              <Typography variant="body2"><span style={{ color: '#462e2e' }}>Product Name: </span>{name_data}</Typography>
              <Typography variant="body2"><span style={{ color: '#462e2e' }}>Product Price: </span> {price_data}</Typography>
            </form>

          </div>

        </Modal>
        <Modal
                    isOpen={this.state.modalIsOpen2}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal2}
                    style={customStyles}
                >

                    <div style={{ backgroundColor: '#fff', padding: 5 }}>
                        <div >
                            <Typography variant="h6">Rename</Typography>
                            {/* <div style={{display: 'flex',flexDirection: 'row',justifyContent:'center',alignItems:'center'}}>
                            <Typography variant="h6" style={{marginTop: 5, color:'#462e2e',marginRight:10}}>Product</Typography> */}
                            <TextField
                                id="outlined-full-width"
                                className="nounderline"
                                style={{ width: '100%', border: '1px solid darkgrey', height: 33, borderRadius: '5px', display: 'flex', position: 'relative', marginTop: 15, paddingLeft: 8, paddingRight: 8 }}
                                fullWidth
                                multiline
                                rows="1"
                                placeholder="Product"
                                value={rename_name}
                                onChange={(e) => this.setState({ rename_name: e.target.value })}
                                required
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            {/* </div>
                            <div style={{display: 'flex',flexDirection: 'row',justifyContent:'center',alignItems:'center'}}>
                            <Typography variant="h6" style={{marginTop: 5, color:'#462e2e',marginRight:10}}>Price</Typography> */}
                            <TextField
                                id="outlined-full-width"
                                className="nounderline"
                                style={{ width: '100%', border: '1px solid darkgrey', height: 33, borderRadius: '5px', display: 'flex', position: 'relative', marginTop: 15, paddingLeft: 8, paddingRight: 8 }}
                                fullWidth
                                multiline
                                rows="1"
                                placeholder="Price"
                                value={rename_price}
                                onChange={(e) => this.setState({ rename_price: e.target.value })}
                                required
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            {/* </div> */}
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', marginTop: 26, justifyContent: 'right' }}>
                                <div style={{ marginRight: 15, marginLeft: 'auto' }}>
                                    <Button onClick={this.closeModal2} variant='outlined' style={{ fontWeight: 400, maxWidth: 99, width: '100%', height: 39, textTransform: 'capitalize' }}>Cancel</Button>
                                </div>
                                <div>
                                    <Button onClick={() => this.rename(this.state.modalIsOpen2)} variant='outlined' style={{ fontWeight: 400, maxWidth: 99, width: '100%', height: 39, color: '#fff', backgroundColor: '#000', textTransform: 'capitalize' }}>Rename</Button>
                                </div>
                            </div>
                        </div>

                    </div>

                </Modal>
      </Grid>

    );


  }

}

export default withStyles(styles)(App);








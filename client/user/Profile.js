import React, {useState, useEffect} from "react"
import {makeStyles} from '@material-ui/core/styles'
import Paper from "@material-ui/core/Paper"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemAvatar from "@material-ui/core/ListItemAvatar"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import ListItemText from "@material-ui/core/ListItemText"
import Avatar from "@material-ui/core/Avatar"
import IconButton from "@material-ui/core/IconButton"
import Typography from "@material-ui/core/Typography"
import Edit from "@material-ui/icons/Edit"
import Person from "@material-ui/icons/Person"
import Divider from "@material-ui/core/Divider"
import auth from "./../auth/auth-helper"
import DeleteUser from "./DeleteUser"
import {read} from './api-user'
import {Redirect, Link} from 'react-router-dom'
import MediaList from './../media/MediaList'
import {listByUser} from './../media/api-media.js'

const useStyles = makeStyles(theme => ({
    root: theme.mixins.gutters({
        maxWidth: 600,
        margin: 'auto',
        padding: theme.spacing(3),
        marginTop: theme.spacing(3)
    }),
    title: {
        marginTop: theme.spacing(3),
        color: theme.palette.protectedTitle
    }
}))

export default function Profile({match}) {
    const classes = useStyles()
    const [user, setUser] = useState({})
    const [media, setMedia] = useState([])
    const [redirectToSignIn, setRedirectToSignIn] = useState(false)
    const jwt = auth.isAuthenticated()

    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal

        read({
            userId: match.params.userId
        }, {t: jwt.token}, signal).then((data) => {
            if(data && data.error) {
                setRedirectToSignIn(true)
            } else {
                setUser(data)
            }
        })

        return function cleanup(){
            abortController.abort()
        }
    }, [match.params.userId])

    useEffect(() => {
        listByUser({userId: match.params.userId}).then((data) => {
            if(data.error) {
                console.log(data.error)
            } else {
                setMedia(data)
            }
        })
    })
    
    if(redirectToSignIn) {
        return <Redirect to='/signin/' />
    }
    return (
        <Paper className={classes.root} elevation={4}>
            <Typography variant="h6" className={classes.title}>
                Profile
            </Typography>
            <List dense>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar>
                            <Person/>
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={user.name} secondary={user.email} />{
                        auth.isAuthenticated().user && auth.isAuthenticated().user._id == user._id && (<ListItemSecondaryAction>
                            <Link to={"/user/edit/" + user._id }  >
                                <IconButton aria-label="Edit" color="primary"  >
                                    <Edit/>
                                </IconButton>
                            </Link>
                            <DeleteUser userId={user._id} />
                        </ListItemSecondaryAction>)
                    }                   
                </ListItem>
                <Divider/>
                <ListItem>
                    <ListItemText primary={"Joined: " + ( new Date(user.created)).toDateString()} />
                </ListItem>
                <Divider/>
                <Typography variant="h7" className={classes.title} style={{marginTop:'100px'}} >My Videos</Typography>
                <ListItem>
                    <MediaList media={media} />
                </ListItem>
            </List>
        </Paper>
    )
}
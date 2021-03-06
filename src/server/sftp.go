package main

import (
	"fmt"

	"github.com/pkg/sftp"
	"golang.org/x/crypto/ssh"
	"golang.org/x/net/websocket"
)

// Map of clients for each tcp connection
type clients struct {
	sshClient  *ssh.Client
	sftpClient *sftp.Client
}

var conns = make(map[string]*clients)

// Create the client configuration/authentication object necessary for ssh
func createConfig(user string, pw string) *ssh.ClientConfig {
	config := &ssh.ClientConfig{
		User: user,
		Auth: []ssh.AuthMethod{
			ssh.Password(pw),
		},
	}
	return config
}

// Initialize the ssh and sftp connections with the given remote host info
func initClients(id string, auth map[string]string, socket *websocket.Conn) bool {

	// Configure credentials and dial up for a tcp connection to a remote machine
	config := createConfig(auth["username"], auth["password"])
	connection, err := ssh.Dial("tcp", auth["hostname"]+":"+auth["port"], config)

	// Attempt to establish an ssh connection
	if err != nil {
		message := "Failed to establish an ssh connection to " + auth["hostname"] + ":" + err.Error()
		fmt.Println("└──", message)
		jsonMsg := jsonify(id, "LOGIN_FAILURE", message)
		_, _ = socket.Write(jsonMsg)

		return false

	} else {
		message := "Successfully established an ssh connection to " + auth["hostname"]
		fmt.Println("└──", message)
		jsonMsg := jsonify(id, "LOGIN_SUCCESS", message)

		_, _ = socket.Write(jsonMsg)
	}

	// Save clients with the existing ssh connection
	conns[id] = &clients{}
	conns[id].sshClient = connection
	conns[id].sftpClient, err = sftp.NewClient(connection)

	// Attempt to establish an sftp connection
	if err != nil {
		message := "Failed to establish an ssh connection to " + auth["hostname"] + ":" + err.Error()
		fmt.Println("└──", message)
		jsonMsg := jsonify(id, "LOGIN_FAIL", message)

		_, _ = socket.Write(jsonMsg)

		return false

	} else {
		message := "Successfully established an sftp connection to " + auth["hostname"]
		fmt.Println("└──", message)
		jsonMessage := jsonify(id, "LOGIN_SUCCESS", message)
		_, _ = socket.Write(jsonMessage)

		return true
	}
}

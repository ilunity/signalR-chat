using System.Text.Json;
using Microsoft.AspNetCore.SignalR;

// using System.Text.Json;


namespace SignalR_server
{
    public class ConnectionUser
    {
        private string _connectionId;
        private string _userName;

        public string connectionId
        {
            get { return _connectionId; }
        }

        public string userName
        {
            get { return _userName; }
        }

        public ConnectionUser(string connectionId, string userName)
        {
            _connectionId = connectionId;
            _userName = userName;
        }
    }

    public class ConnectionMapping
    {
        private readonly Dictionary<string, string> _connections =
            new Dictionary<string, string>();

        public int Count
        {
            get { return _connections.Count; }
        }

        public void Add(string connectionId, string userName)
        {
            lock (_connections)
            {
                _connections.Add(connectionId, userName);
            }
        }

        public string GetUserName(string connectionId)
        {
            string userName;
            if (_connections.TryGetValue(connectionId, out userName))
            {
                return userName;
            }

            return "";
        }

        public bool Contains(string connectionId)
        {
            return _connections.ContainsKey(connectionId);
        }

        public void ChangeName(string connectionId, string userName)
        {
            lock (_connections)
            {
                _connections[connectionId] = userName;
            }
        }

        public void Remove(string connectionId)
        {
            lock (_connections)
            {
                _connections.Remove(connectionId);
            }
        }

        public List<ConnectionUser> ToList()
        {
            List<ConnectionUser> list = new List<ConnectionUser>();

            foreach (var connection in _connections)
            {
                list.Add(new ConnectionUser(connection.Key, connection.Value));
            }

            return list;
        }
    }

    public class ChatHub : Hub
    {
        private readonly static ConnectionMapping _connections =
            new ConnectionMapping();

        public async Task SendMessage(string message, string who)
        {
            string connectionId = Context.ConnectionId;
            string userName = _connections.GetUserName(connectionId);

            await this.Clients.Client(who)
                .SendAsync("ReceiveMessage", message, new ConnectionUser(connectionId, userName));

            if (connectionId != who)
            {
                await this.Clients.Client(connectionId)
                    .SendAsync("ReceiveMyMessage", message, who, connectionId);
            }
        }

        public async Task UpdateUsers()
        {
            await this.Clients.All.SendAsync(
                "ReceiveUsers",
                _connections.ToList()
            );
        }

        public async Task ConnectUser(string userName)
        {
            if (!_connections.Contains(Context.ConnectionId))
            {
                _connections.Add(Context.ConnectionId, userName);
            }
            else
            {
                _connections.ChangeName(Context.ConnectionId, userName);
            }

            await UpdateUsers();
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            _connections.Remove(Context.ConnectionId);

            return base.OnDisconnectedAsync(exception);
        }
    }
}
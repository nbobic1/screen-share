"""
import sys
from PyQt5.QtWidgets import QApplication, QWidget
from PyQt5.QtGui import QPainter, QBrush, QPen
from PyQt5.QtCore import Qt, QPoint
from PyQt5.QtCore import Qt, QPoint, pyqtSignal
import socketio 


class CustomWidget(QWidget):
    move_rectangle = pyqtSignal(int, int)
    def __init__(self):
        super().__init__()

        # Set the widget's properties
        
        self.setAttribute(Qt.WA_TranslucentBackground)
        self.setWindowFlags(Qt.FramelessWindowHint | Qt.WindowStaysOnTopHint)
        self.setGeometry(0, 0, QApplication.desktop().screenGeometry().width(), QApplication.desktop().screenGeometry().height())

        # Initialize the position of the rectangle
        self.rect_position = QPoint(50, 50)
  # Connect the move_rectangle signal to the update_position slot
        self.move_rectangle.connect(self.update_position)

    def update_position(self, x, y):
        # Update the position of the rectangle
        self.rect_position = QPoint(x, y)

        # Redraw the widget to display the new position of the rectangle
        self.update()
    def paintEvent(self, event):
        # Create a QPainter object
        painter = QPainter(self)

        # Set the brush and pen colors
        painter.setBrush(QBrush(Qt.blue))
        painter.setPen(QPen(Qt.red, 3))

        # Draw the rectangle on the widget's background
        painter.drawRect(self.rect_position.x(), self.rect_position.y(), 100, 100)

    def mousePressEvent(self, event):
        # Update the position of the rectangle if the mouse is pressed inside it
        if self.rect().contains(event.pos()):
            self.rect_offset = event.pos() - self.rect_position

    def mouseMoveEvent(self, event):
        # Move the rectangle if the mouse is dragged inside it
        if event.buttons() == Qt.LeftButton:
            self.rect_position = event.pos() - self.rect_offset
            self.update()

# Create the application
app = QApplication(sys.argv)

# Create a custom widget and show it
widget = CustomWidget()
widget.show()
#Ovako pomjeram rectangel
widget.move_rectangle.emit(400, 200)
#ovdje odbijem koordinate pa mjenjam kockuimport pkg_resources
# create a SocketIO object



sys.exit(app.exec_())
# Run the application



# connect to the server
sio = socketio.Client(60,60)
sio.connect('http://localhost:3000', transports=['websocket'])
@sio.on('mouseSend')
def on_message(data):
    print('message:', data)
    widget.move_rectangle.emit(400, 200)
sio.wait()
"""
import sys
from PyQt5.QtWidgets import QApplication, QWidget
from PyQt5.QtGui import QPainter, QBrush, QPen
from PyQt5.QtCore import Qt, QPoint
from PyQt5.QtCore import Qt, QPoint, pyqtSignal
import socketio 


class CustomWidget(QWidget):
    move_rectangle = pyqtSignal(int, int)
    def __init__(self):
        super().__init__()

        # Set the widget's properties
        
        self.setAttribute(Qt.WA_TranslucentBackground)
        self.setWindowFlags(Qt.FramelessWindowHint | Qt.WindowStaysOnTopHint)
        self.setGeometry(0, 0, QApplication.desktop().screenGeometry().width(), QApplication.desktop().screenGeometry().height())

        # Initialize the position of the rectangle
        self.rect_position = QPoint(50, 50)
        
        # Create a SocketIO object
        sio = socketio.Client()
        sio.connect('http://localhost:3000', transports=['websocket'])

        # Connect the move_rectangle signal to the update_position slot
        self.move_rectangle.connect(self.update_position)

        # Define a function to handle the 'mouseSend' event
        @sio.on('mouseSend')
        def on_message(data):
            print('message:', data)
            self.move_rectangle.emit(data['x'], data['y'])

    def update_position(self, x, y):
        # Update the position of the rectangle
        self.rect_position = QPoint(x, y)

        # Redraw the widget to display the new position of the rectangle
        self.update()
    def paintEvent(self, event):
        # Create a QPainter object
        painter = QPainter(self)

        # Set the brush and pen colors
        painter.setBrush(QBrush(Qt.blue))
        painter.setPen(QPen(Qt.red, 3))

        # Draw the rectangle on the widget's background
        painter.drawRect(self.rect_position.x(), self.rect_position.y(), 100, 100)

    def mousePressEvent(self, event):
        # Update the position of the rectangle if the mouse is pressed inside it
        if self.rect().contains(event.pos()):
            self.rect_offset = event.pos() - self.rect_position

    def mouseMoveEvent(self, event):
        # Move the rectangle if the mouse is dragged inside it
        if event.buttons() == Qt.LeftButton:
            self.rect_position = event.pos() - self.rect_offset
            self.update()

# Create the application
app = QApplication(sys.argv)

# Create a custom widget and show it
widget = CustomWidget()
widget.show()

sys.exit(app.exec_())
# Run the application

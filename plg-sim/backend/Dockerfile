FROM node:18-alpine

# Install Python, SSL libraries, and build dependencies
RUN apk add --no-cache \
    python3 \
    py3-pip \
    openssl \
    openssl-dev \
    python3-dev \
    make \
    g++ \
    libffi-dev \
    musl-dev \
    && ln -sf python3 /usr/bin/python

# Create and activate virtual environment
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install Python packages in virtual environment
RUN pip install --no-cache-dir \
    streamlit==1.32.0 \
    requests==2.31.0 \
    python-dotenv==1.0.0

WORKDIR /app

# Only copy package files first for better caching
COPY package*.json ./

# Install dependencies (including axios)
RUN npm install --production

# Now copy the rest of the app
COPY . .

EXPOSE 3001

CMD ["node", "index.js"]
